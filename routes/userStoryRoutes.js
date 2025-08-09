const express = require('express');
const router = express.Router();
const UserStory = require('../models/UserStory');
const User = require('../models/User');
const ProjectStory = require('../models/ProjectStory');
const { authenticateToken } = require('../utils/jwtUtils');

router.post('/new-project', authenticateToken, async (req, res) => {
    const { project, description } = req.body;

    try {
        const newProject = new ProjectStory({
            project: project,
            description: description,
            userId: req.user.id,
        });

        const savedProject = await newProject.save();

        // Atualiza o modelo User para adicionar o ID do novo projeto à lista de projetos do usuário
        await User.findByIdAndUpdate(req.user.id, {
            $push: { projectId: savedProject._id }
        });

        res.status(200).json(savedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create project" });
    }
});


router.post('/', authenticateToken, async (req, res) => {
    const { projectId } = req.body;
    
    try {
        const projectStory = await ProjectStory.findOne({ _id: projectId, userId: req.user.id });

        if (!projectStory) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const prompt = `
            Project: ${projectStory.project}
            Description: ${projectStory.description}
            User Type: ${req.body.userType || ''}
            User Goal: ${req.body.userGoal || ''}
            User Challenge: ${req.body.userChallenge || ''}
            User Action: ${req.body.userAction || ''}
            User Motivation: ${req.body.userMotivation || ''}
            Acceptance Criteria: ${req.body.acceptanceCriteria || ''}
            Technical Requirements: ${req.body.technicalRequirements || ''}
            Priority: ${req.body.priority || ''}
            Additional Notes: ${req.body.additionalNotes || ''}

            Com base nas informações acima, crie uma história de usuário detalhada seguindo os princípios de engenharia de software e certifique-se de criar uma história com texto contínuo e fluido e no idioma português do Brasil, limite a história gerada à 500 caracteres e finalize a história nesse limite de caracteres.
        `;

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
                n: 1
            })
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        
        if (!response.ok) {
            throw new Error(`OpenAI API returned status ${response.status}`);
        }

        const data = await response.json();
        const stories = data.choices.map(choice => choice.message.content.trim());

        const userStory = new UserStory({
            stories: stories,
            userId: req.user.id,
            projectId: projectId
        });
        const savedUserStory = await userStory.save();

        projectStory.userStoriesId.push(savedUserStory._id);
        await projectStory.save();

        res.status(200).json({ userStory: stories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate user story" });
    }
});

router.get('/project/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const project = await ProjectStory.findOne({ _id: id, userId: req.user.id });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

router.get('/all-projects', authenticateToken, async (req, res) => {
    try {
        const projects = await ProjectStory.find({ userId: req.user.id });

        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const projectStories = await ProjectStory.find({ userId: req.user.id }).populate('userStoriesId');
        const stories = projectStories.flatMap(project => project.userStoriesId.map(story => ({ project: project.project, story: story })));
        res.status(200).json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user stories' });
    }
});

router.get('/project-stories/:projectId', authenticateToken, async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await ProjectStory.findOne({ _id: projectId, userId: req.user.id }).populate('userStoriesId');
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const stories = project.userStoriesId.map(story => ({
            storyId: story._id,
            stories: story.stories,
            storyIndex: story.storyIndex
        }));

        res.status(200).json({ project: project.project, stories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch project stories' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userStory } = req.body;

    try {
        const story = await UserStory.findById(id);

        if (!story || story.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: 'User story not found or unauthorized' });
        }

        story.stories = userStory; 
        await story.save();

        res.status(200).json({ message: 'User story updated successfully', story });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user story' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const story = await UserStory.findById(id);

        if (!story || story.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: 'User story not found or unauthorized' });
        }

        await UserStory.deleteOne({ _id: id })

        const projectUpdateResult = await ProjectStory.findByIdAndUpdate(
            story.projectId,
            { $pull: { userStoriesId: id } },
            { new: true }
        );

        if (!projectUpdateResult) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'User story deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user story' });
    }
});

module.exports = router;


const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
    stories: {
        type: [String],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectStory',
        required: true
    },
    storyIndex: {
        type: Number,
        required: true,
        default: 0
    }
});

userStorySchema.pre('save', async function(next) {
    if (this.isNew) {
        // Find the highest storyIndex for the given projectId and increment by 1
        const lastStory = await mongoose.model('UserStory').findOne({ projectId: this.projectId }).sort('-storyIndex');
        this.storyIndex = lastStory ? lastStory.storyIndex + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('UserStory', userStorySchema);

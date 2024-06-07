const mongoose = require('mongoose');

const projectStorySchema = new mongoose.Schema({
    project: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userStoriesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserStory'
    }]
});

module.exports = mongoose.model('ProjectStory', projectStorySchema);

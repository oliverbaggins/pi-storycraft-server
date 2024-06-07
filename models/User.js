const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectStory'
    }],
    userStoriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserStory'
    }
});

module.exports = mongoose.model('User', UserSchema);

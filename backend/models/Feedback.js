const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

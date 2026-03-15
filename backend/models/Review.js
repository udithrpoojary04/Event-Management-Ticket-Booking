const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
    },
}, { timestamps: true });

// One review per user per event
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

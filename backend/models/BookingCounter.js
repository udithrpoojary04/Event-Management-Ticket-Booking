const mongoose = require('mongoose');

const bookingCounterSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        unique: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('BookingCounter', bookingCounterSchema);

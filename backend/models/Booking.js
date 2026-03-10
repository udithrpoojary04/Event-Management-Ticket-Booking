const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    eventTitle: { type: String, default: '' },
    eventImage: { type: String, default: '' },
    eventDate: { type: String, default: '' },
    eventLocation: { type: String, default: '' },
    ticketType: {
        type: String,
        required: [true, 'Ticket type is required'],
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    serviceFee: {
        type: Number,
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed',
    },
    paymentMethod: {
        type: String,
        default: 'Credit Card',
    },
    qrCode: {
        type: String,
        default: '',
    },
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

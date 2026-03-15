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
    bookingId: {
        type: Number,
        default: null,
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
    checkedInAt: {
        type: Date,
        default: null,
    },
    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ qrCode: 1 });
bookingSchema.index({ event: 1, bookingId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Booking', bookingSchema);

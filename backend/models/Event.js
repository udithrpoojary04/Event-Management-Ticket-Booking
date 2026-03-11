const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Number, required: true, default: 0 },
}, { _id: false });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
    },
    endDate: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    venue: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    organizer: {
        type: String,
        default: '',
    },
    organizerAvatar: {
        type: String,
        default: '',
    },
    tickets: [ticketSchema],
    totalCapacity: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    tags: [{
        type: String,
    }],
}, { timestamps: true });

// Pre-save: keep totalCapacity in sync with sum of ticket availables + sold
eventSchema.pre('save', function (next) {
    if (this.tickets && this.tickets.length > 0) {
        const ticketSum = this.tickets.reduce((sum, t) => sum + (t.available || 0), 0);
        this.totalCapacity = ticketSum + (this.sold || 0);
    }
    next();
});

// Text index for search
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);

const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings - Get user's bookings
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event', 'title image date location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/bookings/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate('event');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/bookings - Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const {
            eventId, ticketType, quantity, unitPrice, totalPrice,
            serviceFee, grandTotal, paymentMethod, eventTitle,
            eventImage, eventDate, eventLocation,
        } = req.body;

        // Verify event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check ticket availability
        const ticket = event.tickets.find(t => t.type === ticketType);
        if (!ticket || ticket.available < quantity) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        // Generate QR code string
        const qrCode = `EVHUB-${Date.now()}-${ticketType.replace(/\s/g, '').toUpperCase().slice(0, 3)}`;

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            event: eventId,
            eventTitle: eventTitle || event.title,
            eventImage: eventImage || event.image,
            eventDate: eventDate || event.date,
            eventLocation: eventLocation || event.location,
            ticketType,
            quantity,
            unitPrice,
            totalPrice,
            serviceFee: serviceFee || 0,
            grandTotal,
            paymentMethod: paymentMethod || 'Credit Card',
            qrCode,
            status: 'confirmed',
        });

        await booking.save();

        // Update ticket availability and sold count
        ticket.available -= quantity;
        event.sold += quantity;
        await event.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Restore ticket availability
        const event = await Event.findById(booking.event);
        if (event) {
            const ticket = event.tickets.find(t => t.type === booking.ticketType);
            if (ticket) {
                ticket.available += booking.quantity;
                event.sold -= booking.quantity;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const Event = require('../models/Event');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/events - List events with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, city, search, minPrice, maxPrice } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }
        if (city && city !== 'All Cities') {
            query.city = city;
        }
        if (search) {
            const s = search.toLowerCase();
            query.$or = [
                { title: { $regex: s, $options: 'i' } },
                { description: { $regex: s, $options: 'i' } },
                { tags: { $regex: s, $options: 'i' } },
            ];
        }
        if (minPrice !== undefined) {
            query['tickets.price'] = { ...query['tickets.price'], $gte: Number(minPrice) };
        }
        if (maxPrice !== undefined) {
            query['tickets.price'] = { ...query['tickets.price'], $lte: Number(maxPrice) };
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/events/featured
router.get('/featured', async (req, res) => {
    try {
        const events = await Event.find({ featured: true });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Fix stale data: if tickets available sum doesn't match totalCapacity - sold
        if (event.tickets && event.tickets.length > 0) {
            const ticketAvailableSum = event.tickets.reduce((sum, t) => sum + (t.available || 0), 0);
            const expectedAvailable = event.totalCapacity - (event.sold || 0);

            if (ticketAvailableSum !== expectedAvailable && expectedAvailable > 0) {
                // Distribute remaining capacity across ticket types proportionally
                if (event.tickets.length === 1) {
                    event.tickets[0].available = expectedAvailable;
                } else {
                    // Distribute evenly, give remainder to the first ticket
                    const perTicket = Math.floor(expectedAvailable / event.tickets.length);
                    const remainder = expectedAvailable - (perTicket * event.tickets.length);
                    event.tickets.forEach((t, i) => {
                        t.available = perTicket + (i === 0 ? remainder : 0);
                    });
                }
                await event.save();
            }
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events - Admin only
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/events/:id - Admin only
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/events/:id - Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

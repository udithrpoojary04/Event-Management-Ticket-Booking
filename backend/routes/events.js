const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');
const Review = require('../models/Review');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for image uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, JPEG, and JPG images are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        // Parse tickets if sent as JSON string (from FormData)
        if (typeof data.tickets === 'string') {
            data.tickets = JSON.parse(data.tickets);
        }
        // Parse tags if sent as JSON string
        if (typeof data.tags === 'string') {
            try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
        }
        // Parse boolean
        if (typeof data.featured === 'string') {
            data.featured = data.featured === 'true';
        }
        const event = new Event(data);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/events/:id - Admin only
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        // Parse tickets if sent as JSON string (from FormData)
        if (typeof data.tickets === 'string') {
            data.tickets = JSON.parse(data.tickets);
        }
        // Parse tags if sent as JSON string
        if (typeof data.tags === 'string') {
            try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
        }
        // Parse boolean
        if (typeof data.featured === 'string') {
            data.featured = data.featured === 'true';
        }
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            data,
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

// Helper: recalculate and persist avg rating on Event
async function syncEventRating(eventId) {
    const stats = await Review.aggregate([
        { $match: { event: eventId } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0;
    const count = stats.length ? stats[0].count : 0;
    await Event.findByIdAndUpdate(eventId, { rating: avg, reviews: count });
}

// GET /api/events/:id/reviews - Public
router.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ event: req.params.id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events/:id/reviews - Authenticated users who have booked
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: 'Comment is required' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existing = await Review.findOne({ event: req.params.id, user: req.user._id });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment.trim();
            await existing.save();
            await syncEventRating(event._id);
            return res.json(existing);
        }

        const review = await Review.create({
            event: req.params.id,
            user: req.user._id,
            name: req.user.name,
            rating,
            comment: comment.trim(),
        });

        await syncEventRating(event._id);
        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already reviewed this event' });
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

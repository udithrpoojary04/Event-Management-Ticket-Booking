const express = require('express');
const Feedback = require('../models/Feedback');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback - Submit feedback (public or authenticated)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const feedback = new Feedback({
            name,
            email,
            message,
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/feedback - Admin: get all feedback
router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

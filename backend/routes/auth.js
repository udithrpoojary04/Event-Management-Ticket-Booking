const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
            phone: phone || '',
            location: location || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json(req.user.toJSON());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const updates = ['name', 'phone', 'location', 'avatar'];
        updates.forEach((field) => {
            if (req.body[field] !== undefined) {
                req.user[field] = req.body[field];
            }
        });

        await req.user.save();
        res.json(req.user.toJSON());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Calculate total revenue
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Revenue by month (current year)
        const currentYear = new Date().getFullYear();
        const revenueByMonth = await Booking.aggregate([
            {
                $match: {
                    status: { $ne: 'cancelled' },
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$grandTotal' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill in all 12 months
        const monthlyRevenue = Array(12).fill(0);
        revenueByMonth.forEach((r) => {
            monthlyRevenue[r._id - 1] = r.total;
        });

        // Tickets sold by event
        const ticketsByEvent = await Booking.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: '$eventTitle',
                    sold: { $sum: '$quantity' },
                },
            },
            { $project: { event: '$_id', sold: 1, _id: 0 } },
            { $sort: { sold: -1 } },
            { $limit: 10 },
        ]);

        // Recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalEvents,
            totalBookings,
            totalRevenue,
            totalUsers,
            revenueByMonth: monthlyRevenue,
            ticketsByEvent,
            recentBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users - List all users
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/bookings - List all bookings
router.get('/bookings', auth, adminOnly, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('event', 'title')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/scan/:qrCode - Find booking by QR code
router.get('/scan/:qrCode', auth, adminOnly, async (req, res) => {
    try {
        const rawQrCode = req.params.qrCode || '';
        const qrCode = decodeURIComponent(rawQrCode).trim();

        if (!qrCode) {
            return res.status(400).json({ message: 'QR code is required' });
        }

        const booking = await Booking.findOne({ qrCode })
            .populate('user', 'name email')
            .populate('event', 'title date time location');

        if (!booking) {
            return res.status(404).json({ message: 'Ticket not found for this QR code' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/bookings/:id/check-in - Mark booking as checked in
router.put('/bookings/:id/check-in', auth, adminOnly, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('event', 'title date time location');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cancelled booking cannot be checked in' });
        }

        if (booking.checkedInAt) {
            return res.status(400).json({ message: 'Ticket already checked in', booking });
        }

        booking.status = 'completed';
        booking.checkedInAt = new Date();
        booking.checkedInBy = req.user._id;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/reviews - List all reviews
router.get('/reviews', auth, adminOnly, async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('event', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/reviews/:id - Delete a review
router.delete('/reviews/:id', auth, adminOnly, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Recalculate event rating after deletion
        const stats = await Review.aggregate([
            { $match: { event: review.event } },
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        const avg = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0;
        const count = stats.length ? stats[0].count : 0;
        await Event.findByIdAndUpdate(review.event, { rating: avg, reviews: count });

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

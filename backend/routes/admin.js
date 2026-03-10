const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
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

module.exports = router;

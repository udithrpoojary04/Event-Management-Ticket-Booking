// Booking service - mock implementation ready for backend
import api from './api';

const mockBookings = [
    {
        id: 'BK-001',
        eventId: '1',
        eventTitle: 'Electronic Music Festival 2026',
        eventImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        eventDate: '2026-04-15',
        eventLocation: 'Madison Square Garden, New York',
        ticketType: 'VIP Pass',
        quantity: 2,
        unitPrice: 199.99,
        totalPrice: 399.98,
        serviceFee: 20.00,
        grandTotal: 419.98,
        status: 'confirmed',
        bookingDate: '2026-02-10',
        paymentMethod: 'Credit Card',
        qrCode: 'EVHUB-BK001-VIP-2026',
    },
    {
        id: 'BK-002',
        eventId: '2',
        eventTitle: 'Tech Innovation Summit',
        eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        eventDate: '2026-05-20',
        eventLocation: 'Convention Center, San Francisco',
        ticketType: 'Premium',
        quantity: 1,
        unitPrice: 349.99,
        totalPrice: 349.99,
        serviceFee: 17.50,
        grandTotal: 367.49,
        status: 'confirmed',
        bookingDate: '2026-02-15',
        paymentMethod: 'PayPal',
        qrCode: 'EVHUB-BK002-PRM-2026',
    },
    {
        id: 'BK-003',
        eventId: '3',
        eventTitle: 'Gourmet Food & Wine Expo',
        eventImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        eventDate: '2026-03-28',
        eventLocation: 'Grand Ballroom, Chicago',
        ticketType: 'Full Experience',
        quantity: 3,
        unitPrice: 129.99,
        totalPrice: 389.97,
        serviceFee: 19.50,
        grandTotal: 409.47,
        status: 'pending',
        bookingDate: '2026-02-20',
        paymentMethod: 'Credit Card',
        qrCode: 'EVHUB-BK003-FEX-2026',
    },
    {
        id: 'BK-004',
        eventId: '5',
        eventTitle: 'Marathon & Fitness Expo',
        eventImage: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
        eventDate: '2026-04-05',
        eventLocation: 'Waterfront Park, Miami',
        ticketType: 'Half Marathon',
        quantity: 1,
        unitPrice: 65.99,
        totalPrice: 65.99,
        serviceFee: 3.30,
        grandTotal: 69.29,
        status: 'completed',
        bookingDate: '2026-01-28',
        paymentMethod: 'Credit Card',
        qrCode: 'EVHUB-BK004-HMR-2026',
    },
];

export const getBookings = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockBookings }), 500);
    });
};

export const getBookingById = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booking = mockBookings.find(b => b.id === id);
            if (booking) resolve({ data: booking });
            else reject(new Error('Booking not found'));
        }, 300);
    });
};

export const createBooking = async (bookingData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newBooking = {
                ...bookingData,
                id: `BK-${Date.now().toString().slice(-4)}`,
                status: 'confirmed',
                bookingDate: new Date().toISOString().split('T')[0],
                qrCode: `EVHUB-${Date.now()}-${bookingData.ticketType?.replace(/\s/g, '').toUpperCase().slice(0, 3)}`,
            };
            resolve({ data: newBooking });
        }, 1000);
    });
};

export const cancelBooking = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { message: 'Booking cancelled' } }), 500);
    });
};

// Admin stats
export const getAdminStats = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    totalEvents: 24,
                    totalBookings: 1847,
                    totalRevenue: 284650,
                    totalUsers: 3256,
                    revenueByMonth: [12400, 18900, 22300, 29500, 34200, 41800, 38600, 35400, 28900, 24100, 19800, 28750],
                    ticketsByEvent: [
                        { event: 'Music Festival', sold: 3847 },
                        { event: 'Tech Summit', sold: 1654 },
                        { event: 'Food Expo', sold: 2156 },
                        { event: 'Art Exhibition', sold: 5230 },
                        { event: 'Marathon', sold: 7845 },
                        { event: 'Startup Night', sold: 387 },
                    ],
                    recentBookings: mockBookings.slice(0, 5),
                }
            });
        }, 600);
    });
};

export { mockBookings };

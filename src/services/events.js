// Mock data and service functions for events
// Ready for real backend integration - just update API calls

import api from './api';

// ===== MOCK DATA =====
const mockEvents = [
    {
        id: '1',
        title: 'Electronic Music Festival 2026',
        description: 'The biggest electronic music festival of the year featuring world-renowned DJs and immersive light shows. Experience three days of non-stop music across five stages, gourmet food, art installations, and unforgettable memories.',
        category: 'Music',
        date: '2026-04-15',
        time: '18:00',
        endDate: '2026-04-17',
        location: 'Madison Square Garden, New York',
        venue: 'Madison Square Garden',
        city: 'New York',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        organizer: 'LiveNation Events',
        organizerAvatar: 'https://ui-avatars.com/api/?name=Live+Nation&background=6366f1&color=fff',
        tickets: [
            { type: 'General Admission', price: 89.99, available: 500 },
            { type: 'VIP Pass', price: 199.99, available: 100 },
            { type: 'Backstage Access', price: 499.99, available: 20 },
        ],
        totalCapacity: 5000,
        sold: 3847,
        featured: true,
        rating: 4.8,
        reviews: 342,
        tags: ['music', 'festival', 'electronic', 'outdoor'],
    },
    {
        id: '2',
        title: 'Tech Innovation Summit',
        description: 'Join industry leaders and innovators for a two-day summit exploring AI, blockchain, quantum computing, and the future of technology. Network with 500+ tech professionals and attend hands-on workshops.',
        category: 'Technology',
        date: '2026-05-20',
        time: '09:00',
        endDate: '2026-05-21',
        location: 'Convention Center, San Francisco',
        venue: 'Moscone Center',
        city: 'San Francisco',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        organizer: 'TechWorld Inc.',
        organizerAvatar: 'https://ui-avatars.com/api/?name=Tech+World&background=059669&color=fff',
        tickets: [
            { type: 'Standard', price: 149.99, available: 300 },
            { type: 'Premium', price: 349.99, available: 80 },
            { type: 'Workshop Bundle', price: 549.99, available: 40 },
        ],
        totalCapacity: 2000,
        sold: 1654,
        featured: true,
        rating: 4.9,
        reviews: 218,
        tags: ['technology', 'conference', 'AI', 'networking'],
    },
    {
        id: '3',
        title: 'Gourmet Food & Wine Expo',
        description: 'Indulge in an extraordinary culinary journey with world-class chefs, sommeliers, and artisans. Savor over 200 dishes, attend cooking demonstrations, and discover the finest wines from around the globe.',
        category: 'Food & Drink',
        date: '2026-03-28',
        time: '11:00',
        endDate: '2026-03-29',
        location: 'Grand Ballroom, Chicago',
        venue: 'Hilton Grand Ballroom',
        city: 'Chicago',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        organizer: 'Culinary Arts Foundation',
        organizerAvatar: 'https://ui-avatars.com/api/?name=Culinary+Arts&background=dc2626&color=fff',
        tickets: [
            { type: 'Tasting Pass', price: 59.99, available: 400 },
            { type: 'Full Experience', price: 129.99, available: 200 },
            { type: 'Chef\'s Table', price: 299.99, available: 30 },
        ],
        totalCapacity: 3000,
        sold: 2156,
        featured: true,
        rating: 4.7,
        reviews: 156,
        tags: ['food', 'wine', 'culinary', 'gourmet'],
    },
    {
        id: '4',
        title: 'International Art Exhibition',
        description: 'Explore breathtaking works from over 150 international artists spanning contemporary, modern, and classical art. Interactive installations, live painting sessions, and artist talks throughout the weekend.',
        category: 'Arts',
        date: '2026-06-10',
        time: '10:00',
        endDate: '2026-06-14',
        location: 'Metropolitan Museum, Los Angeles',
        venue: 'LA Contemporary Art Museum',
        city: 'Los Angeles',
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
        organizer: 'Global Art Collective',
        organizerAvatar: 'https://ui-avatars.com/api/?name=Art+Collective&background=7c3aed&color=fff',
        tickets: [
            { type: 'Day Pass', price: 25.99, available: 1000 },
            { type: 'Week Pass', price: 79.99, available: 500 },
            { type: 'Collector Access', price: 199.99, available: 50 },
        ],
        totalCapacity: 8000,
        sold: 5230,
        featured: false,
        rating: 4.6,
        reviews: 89,
        tags: ['art', 'exhibition', 'gallery', 'culture'],
    },
    {
        id: '5',
        title: 'Marathon & Fitness Expo',
        description: 'Run through the scenic waterfront course in this annual marathon combined with a fitness expo featuring the latest gear, nutrition products, and wellness workshops.',
        category: 'Sports',
        date: '2026-04-05',
        time: '06:00',
        endDate: '2026-04-05',
        location: 'Waterfront Park, Miami',
        venue: 'Bayfront Park',
        city: 'Miami',
        image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
        organizer: 'FitLife Events',
        organizerAvatar: 'https://ui-avatars.com/api/?name=FitLife&background=ea580c&color=fff',
        tickets: [
            { type: '5K Run', price: 35.99, available: 2000 },
            { type: 'Half Marathon', price: 65.99, available: 1000 },
            { type: 'Full Marathon', price: 89.99, available: 500 },
        ],
        totalCapacity: 10000,
        sold: 7845,
        featured: true,
        rating: 4.5,
        reviews: 423,
        tags: ['sports', 'marathon', 'fitness', 'running'],
    },
    {
        id: '6',
        title: 'Startup Pitch Night',
        description: 'Watch the most promising startups pitch their ideas to a panel of top venture capitalists. Network with founders, investors, and tech enthusiasts in an electric atmosphere.',
        category: 'Business',
        date: '2026-03-15',
        time: '19:00',
        endDate: '2026-03-15',
        location: 'Innovation Hub, Austin',
        venue: 'Capital Factory',
        city: 'Austin',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        organizer: 'StartupGrind',
        organizerAvatar: 'https://ui-avatars.com/api/?name=StartupGrind&background=0891b2&color=fff',
        tickets: [
            { type: 'Attendee', price: 19.99, available: 300 },
            { type: 'Investor Pass', price: 99.99, available: 50 },
        ],
        totalCapacity: 500,
        sold: 387,
        featured: false,
        rating: 4.4,
        reviews: 67,
        tags: ['business', 'startup', 'networking', 'pitch'],
    },
    {
        id: '7',
        title: 'Jazz Under the Stars',
        description: 'An enchanting evening of smooth jazz performed under the open sky. Bring your blankets, enjoy artisanal cocktails, and lose yourself in the melodic sounds of Grammy-winning jazz artists.',
        category: 'Music',
        date: '2026-05-08',
        time: '20:00',
        endDate: '2026-05-08',
        location: 'Central Park, New York',
        venue: 'SummerStage',
        city: 'New York',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
        organizer: 'Jazz Foundation',
        organizerAvatar: 'https://ui-avatars.com/api/?name=Jazz+Foundation&background=b45309&color=fff',
        tickets: [
            { type: 'Lawn Seating', price: 45.99, available: 800 },
            { type: 'Reserved Seating', price: 89.99, available: 200 },
            { type: 'VIP Lounge', price: 179.99, available: 50 },
        ],
        totalCapacity: 2000,
        sold: 1432,
        featured: false,
        rating: 4.9,
        reviews: 198,
        tags: ['music', 'jazz', 'outdoor', 'nightlife'],
    },
    {
        id: '8',
        title: 'Digital Marketing Masterclass',
        description: 'Level up your marketing skills with this intensive one-day masterclass covering SEO, social media strategy, content marketing, and paid advertising from industry experts.',
        category: 'Education',
        date: '2026-04-22',
        time: '09:00',
        endDate: '2026-04-22',
        location: 'Business Center, Seattle',
        venue: 'WeWork Tower',
        city: 'Seattle',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        organizer: 'DigiLearn Academy',
        organizerAvatar: 'https://ui-avatars.com/api/?name=DigiLearn&background=4f46e5&color=fff',
        tickets: [
            { type: 'Online Access', price: 49.99, available: 1000 },
            { type: 'In-Person', price: 129.99, available: 100 },
            { type: 'In-Person + Recording', price: 179.99, available: 50 },
        ],
        totalCapacity: 1200,
        sold: 876,
        featured: false,
        rating: 4.7,
        reviews: 234,
        tags: ['education', 'marketing', 'digital', 'workshop'],
    },
];

const categories = ['All', 'Music', 'Technology', 'Food & Drink', 'Arts', 'Sports', 'Business', 'Education'];
const cities = ['All Cities', 'New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Miami', 'Austin', 'Seattle'];

// ===== SERVICE FUNCTIONS =====
export const getEvents = async (filters = {}) => {
    // Mock implementation - replace with: return api.get('/events', { params: filters });
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockEvents];
            if (filters.category && filters.category !== 'All') {
                filtered = filtered.filter(e => e.category === filters.category);
            }
            if (filters.city && filters.city !== 'All Cities') {
                filtered = filtered.filter(e => e.city === filters.city);
            }
            if (filters.search) {
                const s = filters.search.toLowerCase();
                filtered = filtered.filter(e =>
                    e.title.toLowerCase().includes(s) ||
                    e.description.toLowerCase().includes(s) ||
                    e.tags.some(t => t.includes(s))
                );
            }
            if (filters.minPrice !== undefined) {
                filtered = filtered.filter(e =>
                    e.tickets.some(t => t.price >= filters.minPrice)
                );
            }
            if (filters.maxPrice !== undefined) {
                filtered = filtered.filter(e =>
                    e.tickets.some(t => t.price <= filters.maxPrice)
                );
            }
            resolve({ data: filtered });
        }, 500);
    });
};

export const getEventById = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const event = mockEvents.find(e => e.id === id);
            if (event) resolve({ data: event });
            else reject(new Error('Event not found'));
        }, 300);
    });
};

export const getFeaturedEvents = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: mockEvents.filter(e => e.featured) });
        }, 400);
    });
};

export const createEvent = async (eventData) => {
    // Mock: return api.post('/events', eventData);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { ...eventData, id: Date.now().toString() } });
        }, 500);
    });
};

export const updateEvent = async (id, eventData) => {
    // Mock: return api.put(`/events/${id}`, eventData);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { ...eventData, id } });
        }, 500);
    });
};

export const deleteEvent = async (id) => {
    // Mock: return api.delete(`/events/${id}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { message: 'Event deleted' } });
        }, 300);
    });
};

export { mockEvents, categories, cities };

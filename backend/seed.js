const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const seedUsers = [
    {
        name: 'John Doe',
        email: 'user@demo.com',
        password: 'demo1234',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
        phone: '+1 234 567 890',
        location: 'New York, USA',
    },
    {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'demo1234',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
        phone: '+1 987 654 321',
        location: 'San Francisco, USA',
    },
];

const seedEvents = [
    {
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
        title: 'Tech Innovation Summit',
        description: 'Join industry leaders and innovators for a two-day summit exploring AI, blockchain, quantum computing, and the future of technology.',
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
        title: 'Gourmet Food & Wine Expo',
        description: 'Indulge in an extraordinary culinary journey with world-class chefs, sommeliers, and artisans.',
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
            { type: "Chef's Table", price: 299.99, available: 30 },
        ],
        totalCapacity: 3000,
        sold: 2156,
        featured: true,
        rating: 4.7,
        reviews: 156,
        tags: ['food', 'wine', 'culinary', 'gourmet'],
    },
    {
        title: 'International Art Exhibition',
        description: 'Explore breathtaking works from over 150 international artists spanning contemporary, modern, and classical art.',
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
        title: 'Marathon & Fitness Expo',
        description: 'Run through the scenic waterfront course in this annual marathon combined with a fitness expo.',
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
        title: 'Startup Pitch Night',
        description: 'Watch the most promising startups pitch their ideas to a panel of top venture capitalists.',
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
        title: 'Jazz Under the Stars',
        description: 'An enchanting evening of smooth jazz performed under the open sky.',
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
        title: 'Digital Marketing Masterclass',
        description: 'Level up your marketing skills with this intensive one-day masterclass.',
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

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        console.log('Cleared existing data');

        // Seed users
        const users = await User.create(seedUsers);
        console.log(`Seeded ${users.length} users`);

        // Seed events
        const events = await Event.create(seedEvents);
        console.log(`Seeded ${events.length} events`);

        console.log('\nSeed completed successfully!');
        console.log('Demo accounts:');
        console.log('  User:  user@demo.com  / demo1234');
        console.log('  Admin: admin@demo.com / demo1234');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();

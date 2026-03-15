const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const adminUser = {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'demo1234',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
    phone: '+1 987 654 321',
    location: 'San Francisco, USA',
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Ensure an admin account exists (idempotent)
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (!existingAdmin) {
            await User.create(adminUser);
            console.log('Created admin user');
        } else {
            console.log('Admin user already exists (no changes)');
        }

        const adminCount = await User.countDocuments({ role: 'admin' });
        console.log(`Total admin users: ${adminCount}`);

        console.log('\nSeed completed successfully!');
        console.log('Admin account: admin@demo.com / demo1234');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();

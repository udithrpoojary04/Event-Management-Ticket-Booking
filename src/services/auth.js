// Auth service - mock implementation ready for backend
import api from './api';

const mockUsers = [
    { id: '1', name: 'John Doe', email: 'user@demo.com', role: 'user', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff', phone: '+1 234 567 890', location: 'New York, USA' },
    { id: '2', name: 'Admin User', email: 'admin@demo.com', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff', phone: '+1 987 654 321', location: 'San Francisco, USA' },
];

export const loginUser = async (email, password) => {
    // Mock: return api.post('/auth/login', { email, password });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email);
            if (user && password.length >= 4) {
                const token = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
                resolve({ data: { token, user } });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 800);
    });
};

export const registerUser = async (userData) => {
    // Mock: return api.post('/auth/register', userData);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser = { ...userData, id: Date.now().toString(), role: 'user', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff` };
            const token = btoa(JSON.stringify({ userId: newUser.id, role: 'user', exp: Date.now() + 86400000 }));
            resolve({ data: { token, user: newUser } });
        }, 800);
    });
};

export const updateProfile = async (userData) => {
    // Mock: return api.put('/auth/profile', userData);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { ...userData } });
        }, 500);
    });
};

export const getProfile = async () => {
    // Mock: return api.get('/auth/profile');
    return new Promise((resolve) => {
        const stored = localStorage.getItem('user');
        setTimeout(() => {
            resolve({ data: stored ? JSON.parse(stored) : mockUsers[0] });
        }, 300);
    });
};

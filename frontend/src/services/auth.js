import api from './api';

export const loginUser = async (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const registerUser = async (userData) => {
    return api.post('/auth/register', userData);
};

export const updateProfile = async (userData) => {
    return api.put('/auth/profile', userData);
};

export const getProfile = async () => {
    return api.get('/auth/profile');
};

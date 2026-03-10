import api from './api';

export const getBookings = async () => {
    const response = await api.get('/bookings');
    return { data: response.data };
};

export const getBookingById = async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return { data: response.data };
};

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return { data: response.data };
};

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return { data: response.data };
};

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return { data: response.data };
};

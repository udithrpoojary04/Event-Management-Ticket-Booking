import api from './api';

const categories = ['All', 'Music', 'Technology', 'Food & Drink', 'Arts', 'Sports', 'Business', 'Education'];
const cities = ['All Cities', 'New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Miami', 'Austin', 'Seattle'];

export const getEvents = async (filters = {}) => {
    const response = await api.get('/events', { params: filters });
    return { data: response.data };
};

export const getEventById = async (id) => {
    const response = await api.get(`/events/${id}`);
    return { data: response.data };
};

export const getFeaturedEvents = async () => {
    const response = await api.get('/events/featured');
    return { data: response.data };
};

export const createEvent = async (eventData) => {
    const response = await api.post('/events', eventData);
    return { data: response.data };
};

export const updateEvent = async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return { data: response.data };
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`);
    return { data: response.data };
};

export const getEventReviews = async (id) => {
    const response = await api.get(`/events/${id}/reviews`);
    return { data: response.data };
};

export const submitReview = async (id, reviewData) => {
    const response = await api.post(`/events/${id}/reviews`, reviewData);
    return { data: response.data };
};

export { categories, cities };

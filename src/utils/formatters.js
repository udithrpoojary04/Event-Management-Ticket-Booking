export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${m} ${ampm}`;
};

export const getStatusColor = (status) => {
    const map = {
        confirmed: 'badge-success',
        pending: 'badge-warning',
        cancelled: 'badge-danger',
        completed: 'badge-primary',
    };
    return map[status] || 'badge-primary';
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const generateBookingRef = () => {
    return 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

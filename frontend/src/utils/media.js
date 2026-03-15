const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const API_ORIGIN = (() => {
    try {
        return new URL(API_BASE_URL).origin;
    } catch {
        return 'http://localhost:8000';
    }
})();

export const resolveMediaUrl = (value) => {
    if (!value || typeof value !== 'string') return '';

    if (/^(https?:\/\/|data:|blob:)/i.test(value)) {
        return value;
    }

    return `${API_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!regex.test(email)) return 'Invalid email address';
    return '';
};

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
    if (!/[0-9]/.test(password)) return 'Must contain a number';
    return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`;
    }
    return '';
};

export const validatePhone = (phone) => {
    if (!phone) return '';
    const regex = /^\+?[\d\s\-()]{7,15}$/;
    if (!regex.test(phone)) return 'Invalid phone number';
    return '';
};

export const validateUrl = (url) => {
    if (!url) return '';
    try {
        new URL(url);
        return '';
    } catch {
        return 'Invalid URL format';
    }
};

export const validatePrice = (price) => {
    if (price === '' || price === undefined) return 'Price is required';
    if (isNaN(price) || Number(price) < 0) return 'Price must be a positive number';
    return '';
};

export const validateForm = (values, rules) => {
    const errors = {};
    Object.keys(rules).forEach(field => {
        const error = rules[field](values[field]);
        if (error) errors[field] = error;
    });
    return errors;
};

import axios from 'axios';

// Create a configured axios instance
// Use environment variable for production, fallback to localhost for development
const getBaseURL = () => {
    // Check if we're in production (Vite sets this automatically)
    if (import.meta.env.PROD) {
        // Use environment variable if set, otherwise use the deployed backend URL
        return import.meta.env.VITE_API_URL || 'https://street-style-india-1.onrender.com/api';
    }
    // Development: use localhost or environment variable
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    // Check if this is an admin-main route
    if (config.url && config.url.includes('/admin-main')) {
        const stockAdminInfo = localStorage.getItem('stockAdminInfo');
        if (stockAdminInfo) {
            const { token } = JSON.parse(stockAdminInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        // Regular user/admin token
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;

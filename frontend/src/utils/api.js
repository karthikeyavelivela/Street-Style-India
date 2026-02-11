import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    // Local backend
    baseURL: 'http://localhost:5000/api',
    // Deployed backend (commented out)
    // baseURL: 'https://street-style-india-1.onrender.com/api',
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

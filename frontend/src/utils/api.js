import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    // Local backend
    // baseURL: 'http://localhost:5000/api',
    // Deployed backend (commented out)
    baseURL: 'https://street-style-india-1.onrender.com/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

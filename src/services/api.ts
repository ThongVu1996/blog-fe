import axios from 'axios';
import { API_BASE_URL, STORAGE_KEY } from '../config/constants';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEY);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Normalize error message
        const message = error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định";
        // Reject with a clean Error object containing the message
        return Promise.reject(new Error(message));
    }
);

export default api;

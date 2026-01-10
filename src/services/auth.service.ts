import api from './api';
import { AuthResponse, ApiResponse } from '../types';
import { STORAGE_KEY } from '../config/constants';

export const authService = {
    /**
     * Login user with email and password
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/login', {
            email,
            password,
        });

        // Store token in localStorage
        if (response.data.data.token) {
            localStorage.setItem(STORAGE_KEY, response.data.data.token);
        }

        return response.data.data;
    },

    /**
     * Logout user
     */
    logout: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(STORAGE_KEY);
    },

    /**
     * Get current auth token
     */
    getToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEY);
    },
};

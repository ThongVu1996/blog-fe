import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services';

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;

    // Actions
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoggedIn: authService.isAuthenticated(),

    login: (user: User) => {
        set({ user, isLoggedIn: true });
    },

    logout: () => {
        authService.logout();
        set({ user: null, isLoggedIn: false });
    },

    checkAuth: () => {
        const isAuthenticated = authService.isAuthenticated();
        set({ isLoggedIn: isAuthenticated });
    },
}));

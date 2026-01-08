import api from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
    /**
     * Get all categories
     */
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<ApiResponse<Category[]> | Category[]>('/categories');

        // Handle both response formats
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return (response.data as ApiResponse<Category[]>).data || [];
    },

    /**
     * Get category by ID
     */
    getById: async (id: number | string): Promise<Category> => {
        const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
        return response.data.data;
    },

    /**
     * Create new category
     */
    create: async (name: string): Promise<Category> => {
        const response = await api.post<ApiResponse<Category>>('/categories', { name });
        return response.data.data;
    },

    /**
     * Update category
     */
    update: async (id: number | string, name: string): Promise<Category> => {
        const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
        return response.data.data;
    },

    /**
     * Delete category
     */
    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },
};

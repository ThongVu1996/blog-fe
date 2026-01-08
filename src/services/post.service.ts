import api from './api';
import { Post, ApiResponse } from '../types';

export const postService = {
    /**
     * Get all posts
     */
    getAll: async (params?: { category_id?: string | number }): Promise<Post[]> => {
        const response = await api.get<ApiResponse<Post[]>>('/posts', { params });
        return response.data.data || [];
    },

    /**
     * Get post by slug
     */
    getDetail: async (slug: string): Promise<Post> => {
        const response = await api.get<ApiResponse<Post>>(`/posts/detail/${slug}`);
        return response.data.data;
    },

    /**
     * Get post by ID
     */
    getById: async (id: number | string): Promise<Post> => {
        const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
        return response.data.data;
    },

    /**
     * Create new post
     */
    create: async (formData: FormData): Promise<Post> => {
        const response = await api.post<ApiResponse<Post>>('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    /**
     * Update existing post
     */
    update: async (id: number | string, formData: FormData): Promise<Post> => {
        const response = await api.post<ApiResponse<Post>>(`/posts/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    /**
     * Delete post
     */
    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },

    /**
     * Import content from external URL (e.g. GitHub Raw)
     * Uses direct axios to avoid baseURL prefix
     */
    importFromUrl: async (url: string): Promise<string> => {
        // Import axios dynamically or usage specific import to bypass default api instance settings
        const axios = require('axios');
        const response = await axios.get(url);
        let content = response.data;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        return content;
    }
};

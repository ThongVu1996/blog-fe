import api from './api';
import { Post, ApiResponse, PaginatedResponse } from '../types';

export const postService = {
    /**
     * Get all posts with pagination
     */
    getAll: async (params?: {
        category_id?: string | number;
        page?: number;
        per_page?: number;
    }): Promise<PaginatedResponse<Post>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Post>>>('/posts', { params });
        return response.data.data || { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 };
    },

    /**
     * Get trending posts
     */
    getTrending: async (limit: number = 5, days: number = 7): Promise<Post[]> => {
        const response = await api.get<ApiResponse<Post[]>>('/posts/trending', {
            params: { limit, days }
        });
        return response.data.data || [];
    },

    /**
     * Get featured posts
     */
    getFeatured: async (): Promise<Post[]> => {
        const response = await api.get<ApiResponse<Post[]>>('/posts/featured');
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
     * Uses a separate axios instance without baseURL for external requests
     */
    importFromUrl: async (url: string): Promise<string> => {
        // Create a fresh axios instance without baseURL for external requests
        const { default: axios } = await import('axios');
        const externalAxios = axios.create();
        const response = await externalAxios.get(url);
        let content = response.data;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        return content;
    }
};

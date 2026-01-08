export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    summary?: string;
    content: string;
    type: 'html' | 'markdown';
    toc?: string;
    image?: string;
    banner?: string;
    category_id: number;
    category?: Category;
    author?: string;
    status: 'published' | 'draft';
    is_featured: boolean;
    featured_order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

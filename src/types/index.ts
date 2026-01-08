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

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status_code?: number;
}

// ============================================
// DATA MODELS
// ============================================

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

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status_code?: number;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface PostCardProps {
    post: Post;
    index?: number;
}

export interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    isLoading?: boolean;
    type?: 'danger' | 'info';
}

export interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

export interface MarkdownProps {
    content: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface MermaidChartProps {
    chart: string;
}

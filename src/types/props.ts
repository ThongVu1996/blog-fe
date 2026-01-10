import { Post } from './models';

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

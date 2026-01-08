import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

// Query keys for better organization
export const queryKeys = {
    posts: {
        all: ['posts'] as const,
        list: (filters?: Record<string, any>) => ['posts', 'list', filters] as const,
        detail: (slug: string) => ['posts', 'detail', slug] as const,
        byId: (id: number | string) => ['posts', 'byId', id] as const,
    },
    categories: {
        all: ['categories'] as const,
        list: () => ['categories', 'list'] as const,
        detail: (id: number | string) => ['categories', 'detail', id] as const,
    },
};

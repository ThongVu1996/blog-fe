import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services';
import { queryKeys } from '../lib/queryClient';

/**
 * Hook to fetch all posts with optional filters
 */
export const usePosts = (params?: { category_id?: string | number }) => {
    return useQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: () => postService.getAll(params),
    });
};

/**
 * Hook to fetch post by slug
 */
export const usePostBySlug = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.posts.detail(slug),
        queryFn: () => postService.getDetail(slug),
        enabled: !!slug,
    });
};

/**
 * Hook to fetch post by ID
 */
export const usePostById = (id: number | string) => {
    return useQuery({
        queryKey: queryKeys.posts.byId(id),
        queryFn: () => postService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => postService.create(formData),
        onSuccess: () => {
            // Invalidate and refetch posts list
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
    });
};

/**
 * Hook to update a post
 */
export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
            postService.update(id, formData),
        onSuccess: (_, variables) => {
            // Invalidate specific post and list
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.byId(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
    });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => postService.delete(id),
        onSuccess: () => {
            // Invalidate posts list
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
    });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services';
import { queryKeys } from '../lib/queryClient';

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories.list(),
        queryFn: () => categoryService.getAll(),
    });
};

/**
 * Hook to fetch category by ID
 */
export const useCategoryById = (id: number | string) => {
    return useQuery({
        queryKey: queryKeys.categories.detail(id),
        queryFn: () => categoryService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new category
 */
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => categoryService.create(name),
        onSuccess: () => {
            // Invalidate and refetch categories list
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
        },
    });
};

/**
 * Hook to update a category
 */
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: number | string; name: string }) =>
            categoryService.update(id, name),
        onSuccess: (_, variables) => {
            // Invalidate specific category and list
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
        },
    });
};

/**
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => categoryService.delete(id),
        onSuccess: () => {
            // Invalidate categories list
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
        },
    });
};

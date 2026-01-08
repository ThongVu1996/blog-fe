import { create } from 'zustand';
import { Category } from '../types';
import { categoryService } from '../services';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCategories: () => Promise<void>;
    addCategory: (name: string) => Promise<Category>;
    updateCategory: (id: number | string, name: string) => Promise<Category>;
    deleteCategory: (id: number | string) => Promise<void>;
    setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const categories = await categoryService.getAll();
            set({ categories, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch categories',
                isLoading: false
            });
        }
    },

    addCategory: async (name: string) => {
        try {
            const newCategory = await categoryService.create(name);
            set((state) => ({
                categories: [...state.categories, newCategory]
            }));
            return newCategory;
        } catch (error: any) {
            set({ error: error.message || 'Failed to create category' });
            throw error;
        }
    },

    updateCategory: async (id: number | string, name: string) => {
        try {
            const updatedCategory = await categoryService.update(id, name);
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id === Number(id) ? updatedCategory : cat
                ),
            }));
            return updatedCategory;
        } catch (error: any) {
            set({ error: error.message || 'Failed to update category' });
            throw error;
        }
    },

    deleteCategory: async (id: number | string) => {
        try {
            await categoryService.delete(id);
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== Number(id)),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete category' });
            throw error;
        }
    },

    setCategories: (categories: Category[]) => {
        set({ categories });
    },
}));

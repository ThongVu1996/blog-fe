export const BASE_URL: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL: string = `${BASE_URL}/api`;
export const STORAGE_KEY: string = 'my_blog_access_token';

export const getImageUrl = (path?: string | null): string => {
  if (!path) return `${BASE_URL}/storage/no-image.jpg`;
  if (typeof path === 'string' && path.startsWith('http')) return path;
  return `${BASE_URL}/storage/${path}`;
};

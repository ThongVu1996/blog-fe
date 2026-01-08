/**
 * Shared slugify function for generating consistent IDs
 * Used by both TOC anchor links and heading ID generation
 */
export const slugify = (str: string): string => {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

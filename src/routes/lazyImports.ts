import { lazy } from 'react';

export const HomePage = lazy(() => import('../pages/HomePage'));
export const PostPage = lazy(() => import('../pages/PostPage'));
export const DetailPage = lazy(() => import('../pages/DetailPage'));
export const LoginPage = lazy(() => import('../pages/LoginPage'));
export const EditorPage = lazy(() => import('../pages/EditorPage'));
export const AboutPage = lazy(() => import('../pages/AboutPage'));
export const CategoryManager = lazy(() => import('../pages/CategoryManager'));
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

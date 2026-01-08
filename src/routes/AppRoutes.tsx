import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PostPage from '../pages/PostPage';
import DetailPage from '../pages/DetailPage';
import LoginPage from '../pages/LoginPage';
import EditorPage from '../pages/EditorPage';
import AboutPage from '../pages/AboutPage';
import CategoryManager from '../pages/CategoryManager';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuthStore } from '../stores';

const AppRoutes = () => {
    const { isLoggedIn } = useAuthStore();

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/category/:slug" element={<PostPage />} />
            <Route path="/posts/:slug" element={<DetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
                path="/manage-categories"
                element={isLoggedIn ? <CategoryManager /> : <Navigate to="/login" />}
            />

            {/* 404 Route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;

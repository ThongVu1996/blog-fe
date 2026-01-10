import { Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import {
    HomePage,
    PostPage,
    DetailPage,
    LoginPage,
    EditorPage,
    AboutPage,
    CategoryManager,
    NotFoundPage,
} from './lazyImports';

// Loading component
import PageLoader from '../components/common/PageLoader';

const AppRoutes = () => {
    const element = useRoutes([
        {
            path: '/',
            element: <HomePage />,
        },
        {
            path: '/posts/category/:slug',
            element: <PostPage />,
        },
        {
            path: '/posts/:slug',
            element: <DetailPage />,
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/editor',
            element: <EditorPage />,
        },
        {
            path: '/editor/:id',
            element: <EditorPage />,
        },
        {
            path: '/about',
            element: <AboutPage />,
        },
        {
            path: '/manage-categories',
            element: (
                <ProtectedRoute>
                    <CategoryManager />
                </ProtectedRoute>
            ),
        },
        {
            path: '/404',
            element: <NotFoundPage />,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);

    return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
};

export default AppRoutes;

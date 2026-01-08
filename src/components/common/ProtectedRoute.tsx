import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface ProtectedRouteProps {
    redirectPath?: string;
    children?: React.ReactNode;
}

const ProtectedRoute = ({
    redirectPath = '/login',
    children,
}: ProtectedRouteProps) => {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

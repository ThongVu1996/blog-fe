import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
}

const PageLoader = ({ message = "Đang tải..." }: PageLoaderProps) => {
    return (
        <div className="loader-container">
            <Loader2 className="spin" size={56} />
            {message && <p>{message}</p>}
        </div>
    );
};

export default PageLoader;


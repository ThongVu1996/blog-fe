import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
}

const PageLoader = ({ message }: PageLoaderProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            {message && <p className="text-cyan-200 animate-pulse">{message}</p>}
        </div>
    );
};

export default PageLoader;

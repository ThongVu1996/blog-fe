import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { ToastProps } from '../types';

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-green-500', icon:
        <CheckCircle size={18} />
    },
    error: {
      bg: 'bg-red-500', icon:
        <AlertCircle size={18} />
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white
  animate-fade-in ${currentStyle.bg}`}>
      {currentStyle.icon}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

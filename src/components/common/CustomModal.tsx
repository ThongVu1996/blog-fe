import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CustomModalProps } from '../../types';

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  isLoading = false,
  type = "danger"
}: CustomModalProps) => {

  // Khóa cuộn trang khi Modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* Ngăn sự kiện nổi bọt để click vào content không bị đóng modal */}
      <div className={`modal-content-aerospace modal-border-${type}`} onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng nhanh */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        {/* Wrapper chứa Icon - Màu sắc được xử lý qua CSS class parent */}
        <div className={`modal-icon-container icon-${type}`}>
          <AlertTriangle size={48} />
        </div>

        <h3 className="modal-title">{title}</h3>

        <div className="modal-text">
          {message}
        </div>

        <div className="modal-buttons">
          <button className="btn-modal btn-outline-space" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </button>

          <button className={`btn-modal btn-${type}-space`} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="modal-spin-icon" size={18} />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;

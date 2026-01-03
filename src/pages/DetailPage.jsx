import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Edit, Trash2, Loader2, 
  AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react';
import { API_BASE_URL, getImageUrl, STORAGE_KEY } from '../config/constants';

const DetailPage = ({ isLoggedIn }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State quản lý Toast: { message: string, type: 'success' | 'error' | null }
  const [toast, setToast] = useState({ message: null, type: null });

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts/detail/${slug}`)
      .then(res => res.json())
      .then(result => {
        setPost(result.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Logic chặn cuộn trang khi Modal mở
  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);

  // Hàm hiển thị Toast và tự đóng sau 3s
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: null });
    }, 3000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}`
        }
      });
      
      if (res.ok) {
        // Thông báo thành công
        showToast("Delete Post Successfully", "success");
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const result = await res.json();
        showToast(result.message || "Delete Post Failed", "error");
      }
    } catch (error) {
      showToast("Network error. Please try again later.", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={48} />
    </div>
  );

  return (
    <div className="detail-view animate-fade">
      {/* 1. Hệ thống Toast hiển thị thông báo */}
      {toast.message && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="detail-back-btn">
          <ChevronLeft size={20} /> Quay lại
        </button>

        {isLoggedIn && (
          <div className="detail-actions">
            <button 
              onClick={() => navigate(`/editor/${post.id}`)} 
              className="btn-primary"
            >
              <Edit size={16} /> Edit
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="btn-delete"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <img src={getImageUrl(post.image)} className="detail-banner" alt={post.title} />
      
      <h1 className="detail-title">{post.title}</h1>
      
      <div className="detail-meta">
        <span>Author: <strong>{post.author}</strong></span>
        <span>•</span>
        <span>Date: {post.created_at?.split('T')[0]}</span>
      </div>

      <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* 2. Popup xác nhận xóa bài viết */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <h3 className="modal-title">Confirm Delete?</h3>
            <p className="modal-text">
              Are you sure you want to delete the post <strong>"{post.title}"</strong>?
            </p>
            <div className="modal-buttons">
              <button 
                className="btn-outline" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="spin" size={16} /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
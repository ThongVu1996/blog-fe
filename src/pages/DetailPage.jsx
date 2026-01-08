import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Edit, Trash2, Loader2,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { API_BASE_URL, getImageUrl, STORAGE_KEY } from '../config/constants';
import Markdown from '../components/Markdown';
import { useRef } from 'react';
import CustomModal from '../components/CustomModal';

const DetailPage = ({ isLoggedIn }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State quản lý Toast: { message: string, type: 'success' | 'error' | null }
  const [toast, setToast] = useState({ message: null, type: null });

  const tocRef = useRef(null);
  const handleOnClick = (e) => {
    const targetLink = e.target.closest('a');
    if (!targetLink || !targetLink.getAttribute('href')?.startsWith('#')) return;
    if (tocRef.current) {
      const allLinks = tocRef.current.querySelectorAll('a');
      allLinks.forEach(link => link.classList.remove('active-toc'));
    }
    targetLink.classList.add('active-toc');
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts/detail/${slug}`)
      .then(res => res.json())
      .then(result => {
        setPost(result.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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
        showToast("Delete Post Successfully", "success");
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const result = await res.json();
        showToast(result.message || "Delete Post Failed", "error");
      }
    } catch (error) {
      showToast(`${error} || Network error. Please try again later.`, "error");
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
            {toast.type === 'success' ?
              <CheckCircle size={20} /> :
              <XCircle size={20} />}
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
            <button onClick={() => navigate(`/editor/${post.id}`)}
              className="btn-edit"
            >
              <Edit size={16} /> Edit
            </button>
            <button onClick={() => setShowDeleteModal(true)}
              className="btn-delete"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <img src={getImageUrl(post.image)} className="detail-banner" alt={post.title} />

      <h1 className="detail-title glitch-title">{post.title}</h1>

      <div className="detail-meta">
        <span>Author: <strong>{post.author}</strong></span>
        <span>•</span>
        <span>Date: {post.created_at?.split('T')[0]}</span>
      </div>
      {
        post.type == 'html' ?
          <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.content }} /> : <div
            className='mask-origin-content'>
            <Markdown content={post.toc} ref={tocRef} onClick={handleOnClick} />
            <Markdown content={post.content} />
          </div>
      }
      {/* 2. Popup xác nhận xóa bài viết */}
      {showDeleteModal && (
        <CustomModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Xác nhận xóa?"
          message={
            <>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{post.title}"</strong>?
              Hành động này sẽ xóa vĩnh viễn dữ liệu khỏi trạm lưu trữ.
            </>
          }
          confirmText="Xác nhận xóa"
          isLoading={isDeleting}
          type="danger"
        />
      )}
    </div>
  );
};

export default DetailPage;

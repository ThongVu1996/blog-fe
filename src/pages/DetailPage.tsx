import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Edit, Trash2, CheckCircle, XCircle, ArrowUp
} from 'lucide-react';
import { getImageUrl } from '../config/constants';
import Markdown from '../components/common/Markdown';
import { useRef } from 'react';
import CustomModal from '../components/common/CustomModal';
import { usePostBySlug, useDeletePost } from '../hooks';
import { useAuthStore } from '../stores';
import PageLoader from '../components/common/PageLoader';

const DetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuthStore();
  const { data: post, isLoading } = usePostBySlug(slug || '');
  const deleteMutation = useDeletePost();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State quản lý Toast: { message: string, type: 'success' | 'error' | null }
  const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'error' | null }>({ message: null, type: null });

  const tocRef = useRef<HTMLDivElement>(null);
  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetLink = (e.target as HTMLElement).closest('a');
    if (!targetLink || !targetLink.getAttribute('href')?.startsWith('#')) return;

    e.preventDefault();

    // Decode URI to match Vietnamese characters in element IDs
    const rawId = targetLink.getAttribute('href')?.slice(1) || '';
    const targetId = decodeURIComponent(rawId);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navbarHeight = 100; // Match scroll-padding-top value
      window.scrollTo({
        top: targetElement.offsetTop - navbarHeight,
        behavior: 'smooth'
      });
    }

    // Update active TOC link
    if (tocRef.current) {
      const allLinks = tocRef.current.querySelectorAll('a');
      allLinks.forEach((link: Element) => link.classList.remove('active-toc'));
    }
    targetLink.classList.add('active-toc');
  };

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

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm hiển thị Toast và tự đóng sau 3s
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: null });
    }, 3000);
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      await deleteMutation.mutateAsync(post.id);
      showToast("Delete Post Successfully", "success");
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      showToast("Delete Post Failed", "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <PageLoader />;

  if (!post) return <div className="loader-container">Không tìm thấy bài viết</div>;

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
            {post.toc && <Markdown content={post.toc} ref={tocRef} onClick={handleOnClick} />}
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
          isLoading={deleteMutation.isPending}
          type="danger"
        />
      )}

      {/* Back to top button */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default DetailPage;

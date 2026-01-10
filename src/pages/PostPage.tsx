import { Navigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PageLoader from '../components/common/PageLoader';
import PostCard from '../components/features/PostCard';
import { usePosts, useCategories } from '../hooks';
import { useState } from 'react';

const PostPage = () => {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const { data: categories = [], isLoading: isCatsLoading } = useCategories();

  const currentCategory = categories.find(c => c.name.toLowerCase() === slug);
  const categoryId = currentCategory?.id;

  const { data: postsData, isLoading: isPostsLoading } = usePosts({
    category_id: categoryId,
    page: currentPage,
    per_page: perPage
  });

  const isLoading = isCatsLoading || (categoryId && isPostsLoading);

  if (isLoading && !isPostsLoading) return <PageLoader message="Đang định vị tọa độ không gian..." />;

  if (!isCatsLoading && !currentCategory) return <Navigate to="/404" replace />;

  const posts = postsData?.data || [];
  const totalPages = postsData?.last_page || 1;
  const currentPageNum = postsData?.current_page || 1;

  // Generate page numbers to display (max 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPageNum - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-container">
      {/* Tiêu đề phần Tất cả bài viết */}
      <div className="section-header">
        <h2 className="glitch-title">
          {currentCategory?.name.toUpperCase()}
        </h2>
        <div className="title-underline"></div>
      </div>

      <div className="post-grid-aerospace">
        {posts?.map((p: any, index: number) => (
          // Truyền index để tạo hiệu ứng màu viền khác nhau (Cyan, Purple, Blue)
          <PostCard key={p.id} post={p} index={index} />
        ))}
      </div>

      {posts.length === 0 && !isPostsLoading && (
        <div className="no-data">
          <p>Chưa có dữ liệu bài viết trong vùng không gian này.</p>
        </div>
      )}

      {/* Phân trang - Pagination Styled */}
      {posts.length > 0 && totalPages > 1 && (
        <div className="pagination-space">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPageNum - 1)}
            disabled={currentPageNum === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              className={`page-btn ${currentPageNum === pageNum ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPageNum + 1)}
            disabled={currentPageNum === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostPage;

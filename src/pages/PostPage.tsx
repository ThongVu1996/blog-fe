import { Navigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PageLoader from '../components/common/PageLoader';
import PostCard from '../components/features/PostCard';
import { usePosts, useCategories } from '../hooks';

const PostPage = () => {
  const { slug } = useParams();

  const { data: categories = [], isLoading: isCatsLoading } = useCategories();

  const currentCategory = categories.find(c => c.name.toLowerCase() === slug);
  const categoryId = currentCategory?.id;

  const { data: posts = [], isLoading: isPostsLoading } = usePosts({ category_id: categoryId });

  const isLoading = isCatsLoading || (categoryId && isPostsLoading);

  if (isLoading && !isPostsLoading) return <PageLoader message="Đang định vị tọa độ không gian..." />;

  if (!isCatsLoading && !currentCategory) return <Navigate to="/404" replace />;

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
      {posts.length > 0 && (
        <div className="pagination-space">
          <button className="page-btn">
            <ChevronLeft size={16} />
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostPage;

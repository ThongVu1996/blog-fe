import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import PostCard from './PostCard'; // Lưu ý: PostCard cần được cập nhật CSS theo bên dưới
import { API_BASE_URL } from '../config/constants';

const CategoryPage = ({ categories }) => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch dữ liệu dựa trên category id
    fetch(`${API_BASE_URL}/posts?category_id=${id}`)
      .then(res => res.json())
      .then(result => {
        setPosts(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="loader-full">
      <Loader2 className="spin-icon" size={48} />
      <p>Đang kết nối trạm vũ trụ...</p>
    </div>
  );

  return (
    <div className="category-container">
      {/* Tiêu đề phần Tất cả bài viết */}
      <div className="section-header">
        <h2 className="glitch-title">TẤT CẢ BÀI VIẾT</h2>
        <div className="title-underline"></div>
      </div>

      <div className="post-grid-aerospace">
        {posts.map((p, index) => (
          // Truyền index để tạo hiệu ứng màu viền khác nhau (Cyan, Purple, Blue)
          <PostCard key={p.id} post={p} index={index} />
        ))}
      </div>

      {posts.length === 0 && (
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

export default CategoryPage;

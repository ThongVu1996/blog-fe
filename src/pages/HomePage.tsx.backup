import { Loader2, TrendingUp, Mail } from 'lucide-react';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks';

const HomePage = () => {
  const { data: posts = [], isLoading } = usePosts();

  if (isLoading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={56} />
      <p>Đang tải dữ liệu kĩ thuật...</p>
    </div>
  );

  // Lấy bài viết đầu tiên làm tiêu điểm (Featured)
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="animate-fade">
      {/* 1. FEATURED SECTION (Tin tiêu điểm) */}
      {featuredPost && (
        <section className="featured-grid">
          <Link to={`/post/${featuredPost.id}`} className="main-featured">
            <img src={featuredPost.banner || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"}
              className="featured-img" alt="Featured" />
            <div className="featured-content">
              <span className="badge">Trending Now</span>
              <h2 className="featured-title">{featuredPost.title}</h2>
              <p>{featuredPost.summary || "Khám phá những thay đổi quan trọng trong hệ thống kĩ thuật mới nhất..."}</p>
            </div>
          </Link>

          <div className="sub-featured-group">
            {/* Bạn có thể lấy thêm 2 bài tiếp theo nếu muốn giống hệt HTML mẫu */}
            <div className="main-featured sub-box">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600" className="featured-img"
                alt="Security" />
              <div className="featured-content small">
                <span className="badge danger">Security</span>
                <h4>Hệ thống bảo mật CI/CD</h4>
              </div>
            </div>
            <div className="main-featured sub-box">
              <img src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600" className="featured-img"
                alt="DevOps" />
              <div className="featured-content small">
                <span className="badge info">DevOps</span>
                <h4>Lộ trình DevOps 2026</h4>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. MAIN LAYOUT (Latest Updates + Sidebar) */}
      <div className="news-layout">
        <main>
          <div className="section-header news-header">
            <div className="header-left">
              <div className="section-indicator"></div>
              <h2 className="section-title">LATEST UPDATES</h2>
            </div>
            <span className="view-all">VIEW ALL →</span>
          </div>

          <div className="news-list">
            {remainingPosts.length > 0 ? (
              remainingPosts.map(p =>
                <PostCard key={p.id} post={p} />)
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Đang cập nhật các bản tin mới nhất...</p>
            )}
          </div>
        </main>

        <aside className="sidebar">
          {/* Trending Box */}
          <div className="sidebar-box">
            <h4>
              <TrendingUp size={16} /> TRENDING TOPICS
            </h4>
            <div className="trending-item">
              <span className="trending-num">01</span>
              <div className="trending-text">Tối ưu chi phí AWS Cloud</div>
            </div>
            <div className="trending-item">
              <span className="trending-num">02</span>
              <div className="trending-text">Bảo mật Docker Image</div>
            </div>
            <div className="trending-item">
              <span className="trending-num">03</span>
              <div className="trending-text">Giám sát Prometheus</div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="sidebar-box newsletter-box">
            <h4>
              <Mail size={16} /> NEWSLETTER
            </h4>
            <p>Nhận tin tức DevOps mới nhất vào hộp thư mỗi sáng.</p>
            <input type="email" placeholder="Email của bạn..." className="form-input" />
            <button className="btn-primary submit-email">ĐĂNG KÝ NGAY</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;

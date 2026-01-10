import { TrendingUp, Mail } from 'lucide-react';
import PostCard from '../components/features/PostCard';
import { useNavigate } from 'react-router-dom';
import { usePosts, useFeaturedPosts, useTrendingPosts } from '../hooks';
import PageLoader from '../components/common/PageLoader';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: postsData, isLoading: isPostsLoading } = usePosts({ per_page: 5 });
  const { data: featuredPosts = [], isLoading: isFeaturedLoading } = useFeaturedPosts();
  const { data: trendingPosts = [], isLoading: isTrendingLoading } = useTrendingPosts(3);

  const isLoading = isPostsLoading || isFeaturedLoading || isTrendingLoading;

  if (isLoading) return <PageLoader />;

  const posts = postsData?.data || [];

  // Get featured posts for the grid (max 3)
  const mainFeatured = featuredPosts[0];
  const subFeatured1 = featuredPosts[1];
  const subFeatured2 = featuredPosts[2];

  return (
    <div className="animate-fade">
      {/* 1. FEATURED SECTION (Tin tiêu điểm) */}
      {mainFeatured && (
        <section className="featured-grid">
          <div onClick={() => navigate(`/posts/${mainFeatured.slug}`)} className="main-featured" style={{ cursor: 'pointer' }}>
            <img src={mainFeatured.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"}
              className="featured-img" alt="Featured" />
            <div className="featured-content">
              <span className="badge">Trending Now</span>
              <h2 className="featured-title">{mainFeatured.title}</h2>
              <p>{mainFeatured.excerpt || "Khám phá những thay đổi quan trọng trong hệ thống kĩ thuật mới nhất..."}</p>
            </div>
          </div>

          <div className="sub-featured-group">
            {subFeatured1 && (
              <div onClick={() => navigate(`/posts/${subFeatured1.slug}`)} className="main-featured sub-box" style={{ cursor: 'pointer' }}>
                <img src={subFeatured1.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600"}
                  className="featured-img" alt={subFeatured1.title} />
                <div className="featured-content small">
                  <span className="badge danger">{subFeatured1.category?.name || 'Tech'}</span>
                  <h4>{subFeatured1.title}</h4>
                </div>
              </div>
            )}
            {subFeatured2 && (
              <div onClick={() => navigate(`/posts/${subFeatured2.slug}`)} className="main-featured sub-box" style={{ cursor: 'pointer' }}>
                <img src={subFeatured2.image || "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600"}
                  className="featured-img" alt={subFeatured2.title} />
                <div className="featured-content small">
                  <span className="badge info">{subFeatured2.category?.name || 'DevOps'}</span>
                  <h4>{subFeatured2.title}</h4>
                </div>
              </div>
            )}
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
            {posts.length > 0 ? (
              posts.map(p =>
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
            {trendingPosts.map((post, index) => (
              <div
                key={post.id}
                className="trending-item"
                onClick={() => navigate(`/posts/${post.slug}`)}
                style={{ cursor: 'pointer' }}
              >
                <span className="trending-num">{String(index + 1).padStart(2, '0')}</span>
                <div className="trending-text">{post.title}</div>
              </div>
            ))}
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

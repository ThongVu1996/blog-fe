import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../config/constants';
import { PostCardProps } from '../types';

const PostCard = ({ post, index }: PostCardProps) => (
  <Link to={`/posts/${post.slug}`} className="news-item animate-fade border-gradient" style={{ animationDelay: `${(index || 0) * 0.1}s` }}>
    {/* Phần hình ảnh bên trái */}
    <div className="news-item-image">
      <img src={getImageUrl(post.image)} alt={post.title} loading="lazy" />
    </div>

    {/* Phần nội dung bên phải */}
    <div className="news-info">
      <span className="news-category">
        {post.category?.name || "INFRASTRUCTURE"}
      </span>

      <h3 className="news-title">{post.title}</h3>

      <p className="news-summary">
        {post.excerpt || post.content?.substring(0, 160).replace(/[#*`]/g, '') + "..."}
      </p>

      <div className="news-footer">
        <div className="news-meta">
          <Clock size={14} className="meta-icon" />
          <span>{post.created_at?.split('T')[0]}</span>
          <span className="meta-dot">•</span>
          <span>5 phút đọc</span>
        </div>
        <div className="news-read-more">
          READ
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </Link>
);

export default PostCard;

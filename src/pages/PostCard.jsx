import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../config/constants';

const PostCard = ({ post }) => (
  <Link to={`/posts/${post.slug}`} className="post-card animate-fade">
    <div className="post-img-container">
      <img src={getImageUrl(post.image)} alt={post.title} className="post-img" />
    </div>
    <div className="post-info">
      <div className="post-meta">
        <Calendar size={12} /> {post.created_at?.split('T')[0]}
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
      <div className="post-more">Read more <ArrowRight size={14} /></div>
    </div>
  </Link>
);

export default PostCard;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { API_BASE_URL } from '../config/constants';

const CategoryPage = ({categories}) => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const value = categories.find(cat => cat.name.toLowerCase() === id)?.id;
    fetch(`${API_BASE_URL}/posts?category_id=${id}`)
      .then(res => res.json())
      .then(result => {
        setPosts(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={40} />
    </div>
  );

  return (
    <div className="animate-fade container" style={{ paddingTop: '40px' }}>
      <div className="post-grid">
        {posts.map(p => <PostCard key={p.categoryName} post={p}  />)}
      </div>
      {posts.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No posts found in this category.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;
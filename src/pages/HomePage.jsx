import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { API_BASE_URL } from '../config/constants';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts`)
      .then(res => res.json())
      .then(result => {
        setPosts(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={56} />
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="animate-fade container">
      <div className="section-header">
        <div className="section-indicator"></div>
        <h2 className="section-title">Newest articles</h2>
      </div>

      <div className="post-grid">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
};

export default HomePage;
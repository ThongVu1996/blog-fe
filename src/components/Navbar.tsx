import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, LogIn, LogOut, Menu, X, Settings } from 'lucide-react';
import { useAuthStore } from '../stores';
import { useCategories } from '../hooks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get auth state from Zustand
  const { isLoggedIn, logout } = useAuthStore();

  // Get categories from React Query
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* LOGO */}
        <div onClick={() => navigate('/')} className="logo" style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <BookOpen color="white" size={20} />
          </div>
          <span className="logo-text">TechBlog</span>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
        >
          {isOpen ?
            <X size={28} /> :
            <Menu size={28} />}
        </button>

        <div id="main-navigation" className={`nav-menu ${isOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="nav-link"
                style={{ cursor: 'pointer' }}
              >
                {cat.name}
              </div>
            ))}
            <div onClick={() => navigate('/about')} className="nav-link" style={{ cursor: 'pointer' }}>About</div>
          </div>

          <div className="nav-auth-group">
            {isLoggedIn ? (
              <>
                <div onClick={() => navigate('/manage-categories')} className="btn-outline" style={{ cursor: 'pointer' }}>
                  <Settings size={18} /> <span>Categories</span>
                </div>
                <div onClick={() => navigate('/editor')} className="btn-primary" style={{ cursor: 'pointer' }}>
                  <Plus size={18} /> <span>Viết bài</span>
                </div>
                <button className="btn-logout" onClick={logout}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div onClick={() => navigate('/login')} className="btn-primary" style={{ cursor: 'pointer' }}>
                <LogIn size={18} /> Login
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

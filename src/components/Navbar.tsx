import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Plus, LogIn, LogOut, Menu, X, Settings } from 'lucide-react';
import { useAuthStore } from '../stores';
import { useCategories } from '../hooks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
        <Link to="/" className="logo">
          <div className="logo-icon">
            <BookOpen color="white" size={20} />
          </div>
          <span className="logo-text">TechBlog</span>
        </Link>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ?
            <X size={28} /> :
            <Menu size={28} />}
        </button>

        <div className={`nav-menu ${isOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="nav-link">
                {cat.name}
              </Link>
            ))}
            <Link to="/about" className="nav-link">About</Link>
          </div>

          <div className="nav-auth-group">
            {isLoggedIn ? (
              <>
                <Link to="/manage-categories" className="btn-outline">
                  <Settings size={18} /> <span>Categories</span>
                </Link>
                <Link to="/editor" className="btn-primary">
                  <Plus size={18} /> <span>Viết bài</span>
                </Link>
                <button className="btn-logout" onClick={logout}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { BookOpen, Plus, LogIn, LogOut, Menu, X } from 'lucide-react';

// const Navbar = ({ categories, isLoggedIn, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   return (
//     <nav className="navbar">
//       <div className="container nav-content">
//         <Link to="/" className="logo">
//           <div className="logo-icon">
//             <BookOpen color="white" size={20} />
//           </div>
//           <span className="logo-text">Blog</span>
//         </Link>

//         {/* Nút Hamburger cho Mobile */}
//         <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         <div className={`nav-menu ${isOpen ? 'is-open' : ''}`}>
//           <div className="nav-links">
//             {categories.map((cat) => (
//               <Link key={cat.id} to={`/category/${cat.name.toLowerCase()}`} className="nav-link">
//                 {cat.name}
//               </Link>
//             ))}
//             <Link to="/about" className="nav-link">About</Link>
//           </div>

//           <div className="nav-auth-group">
//             {isLoggedIn ? (
//               <>
//                 <Link to="/editor" className="btn-primary">
//                   <Plus size={18} /> Viết bài
//                 </Link>
//                 <button className="btn-logout" onClick={onLogout}>
//                   <LogOut size={18} />
//                 </button>
//               </>
//             ) : (
//               <Link to="/login" className="btn-primary">
//                 <LogIn size={18} /> Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Plus, LogIn, LogOut, Menu, X, Settings } from 'lucide-react';

const Navbar = ({ categories, isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
          {isOpen ? <X size={28} /> : <Menu size={28} />}
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
                <button className="btn-logout" onClick={onLogout}>
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
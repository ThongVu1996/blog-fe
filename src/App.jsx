// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
// import {
//   BookOpen, Calendar, ArrowRight, ChevronLeft, 
//   Loader2, Plus, Save, Edit, LogIn, LogOut, Lock
// } from 'lucide-react';

// // ==========================================
// // 1. CẤU HÌNH & HELPER
// // ==========================================
// const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
// const API_BASE_URL = `${BASE_URL}/api`;
// const STORAGE_KEY = 'my_blog_access_token';

// const getImageUrl = (path) => {
//   if (!path) return 'https://via.placeholder.com/400x250?text=No+Image';
//   if (typeof path === 'string' && path.startsWith('http')) return path;
//   return `${BASE_URL}/storage/${path}`;
// };

// // ==========================================
// // 2. TOÀN BỘ CSS (Gộp chung)
// // ==========================================
// const cssStyles = `
// :root {
//   --primary: #4f46e5; --primary-hover: #4338ca; --bg-body: #fafbfc;
//   --text-main: #1f2937; --text-muted: #6b7280; --text-light: #9ca3af;
//   --white: #ffffff; --border: #f3f4f6; --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
// }
// * { box-sizing: border-box; margin: 0; padding: 0; }
// body { font-family: 'Inter', sans-serif; background-color: var(--bg-body); color: var(--text-main); line-height: 1.6; }
// .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
// .navbar { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid var(--border); height: 70px; display: flex; align-items: center; }
// .nav-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
// .logo { text-decoration: none; color: inherit; display: flex; align-items: center; gap: 12px; }
// .logo-icon { background: var(--primary); padding: 8px; border-radius: 10px; display: flex; }
// .logo span { font-size: 1.35rem; font-weight: 900; letter-spacing: -0.02em; }
// .nav-menu-desktop { display: flex; gap: 20px; align-items: center; }
// .nav-link { text-decoration: none; color: var(--text-muted); font-weight: 600; font-size: 0.95rem; transition: 0.2s; }
// .nav-link:hover { color: var(--primary); }
// .nav-auth-group { display: flex; gap: 12px; align-items: center; }
// .hero { padding: 80px 0 60px; }
// .hero h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 20px; }
// .hero h1 span { color: var(--primary); }
// .hero p { color: var(--text-muted); font-size: 1.25rem; max-width: 600px; }
// .post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 80px; }
// @media (max-width: 768px) { .post-grid { grid-template-columns: 1fr; } .nav-menu-desktop { display: none; } }
// .post-card { background: var(--white); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: 0.3s; box-shadow: var(--shadow-sm); text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column; }
// .post-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
// .post-img-container { aspect-ratio: 16/10; overflow: hidden; background: #eee; }
// .post-img { width: 100%; height: 100%; object-fit: cover; }
// .post-info { padding: 24px; flex-grow: 1; display: flex; flex-direction: column; }
// .post-meta { font-size: 0.8rem; color: var(--text-light); margin-bottom: 12px; font-weight: 500; }
// .post-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
// .post-excerpt { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
// .post-more { margin-top: auto; color: var(--primary); font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; }
// .detail-view { max-width: 800px; margin: 40px auto; }
// .detail-banner { width: 100%; border-radius: 24px; max-height: 450px; object-fit: cover; margin-top: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
// .detail-title { margin: 30px 0; font-size: 2.8rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; }
// .detail-content { font-size: 1.15rem; line-height: 1.8; color: #374151; }
// .form-group { margin-bottom: 24px; }
// .form-label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 0.9rem; }
// .form-input, .form-textarea, .form-select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: #f9fafb; font-size: 1rem; color: #000; }
// .form-input:focus, .form-textarea:focus { border-color: var(--primary); outline: none; background: #fff; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
// .btn-primary { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; text-decoration: none; }
// .btn-primary:hover { background: var(--primary-hover); transform: translateY(-2px); }
// .btn-outline { background: white; color: var(--text-muted); border: 1px solid var(--border); padding: 10px 18px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
// .btn-logout { background: none; border: 1px solid #fee2e2; color: #ef4444; padding: 8px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
// .btn-logout:hover { background: #fef2f2; }
// .login-container { display: flex; justify-content: center; padding-top: 80px; }
// .login-form { background: white; padding: 40px; border-radius: 24px; border: 1px solid var(--border); width: 100%; max-width: 400px; text-align: center; box-shadow: var(--shadow-sm); }
// .editor-container { max-width: 850px; margin: 40px auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid var(--border); }
// .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
// .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; color: var(--primary); font-weight: 600; gap: 12px; }
// .animate-fade { animation: fadeIn 0.5s ease-out forwards; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .spin { animation: spin 1s linear infinite; }
// @keyframes spin { to { transform: rotate(360deg); } }
// `;

// // ==========================================
// // 3. SHARED COMPONENTS
// // ==========================================

// const Navbar = ({ categories, isLoggedIn, onLogout }) => (
//   <nav className="navbar">
//     <div className="container nav-content">
//       <Link to="/" className="logo">
//         <div className="logo-icon"><BookOpen color="white" size={20} /></div>
//         <span>MyTechBlog</span>
//       </Link>
//       <div className="nav-menu-desktop">
//         {categories.map(cat => (
//           <Link key={cat.id} to={`/category/${cat.id}`} className="nav-link">{cat.name}</Link>
//         ))}
//         <Link to="/about" className="nav-link">About</Link>
//         {isLoggedIn ? (
//           <div className="nav-auth-group">
//             <Link to="/editor" className="btn-primary"><Plus size={16} /> Viết bài</Link>
//             <button className="btn-logout" onClick={onLogout} title="Đăng xuất"><LogOut size={16} /></button>
//           </div>
//         ) : (
//           <Link to="/login" className="btn-primary"><LogIn size={16} /> Admin</Link>
//         )}
//       </div>
//     </div>
//   </nav>
// );

// const PostCard = ({ post }) => (
//   <Link to={`/posts/${post.slug}`} className="post-card animate-fade">
//     <div className="post-img-container">
//       <img src={getImageUrl(post.image)} alt={post.title} className="post-img" />
//     </div>
//     <div className="post-info">
//       <div className="post-meta">
//         <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
//         {post.created_at?.split('T')[0]} • {post.category?.name || 'Chung'}
//       </div>
//       <h3 className="post-title">{post.title}</h3>
//       <p className="post-excerpt">{post.excerpt}</p>
//       <div className="post-more">Đọc thêm <ArrowRight size={14} /></div>
//     </div>
//   </Link>
// );

// // ==========================================
// // 4. VIEWS
// // ==========================================

// const HomeView = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/posts`)
//       .then(res => res.json())
//       .then(result => { setPosts(result.data || []); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="loader-container"><Loader2 className="spin" size={48} /><p>Đang tải bài viết...</p></div>;

//   return (
//     <div className="animate-fade">
//       <section className="hero">
//         <h1>Blog <span>DevOps</span> 2026</h1>
//         <p>Lưu trữ và chia sẻ kiến thức thực chiến về Docker, CI/CD và Cloud trên hạ tầng VPS Alibaba Cloud.</p>
//       </section>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
//         <div style={{ width: '6px', height: '30px', background: 'var(--primary)', borderRadius: '4px' }}></div>
//         <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mới nhất</h2>
//       </div>
//       <div className="post-grid">
//         {posts.map(p => <PostCard key={p.id} post={p} />)}
//       </div>
//     </div>
//   );
// };

// const CategoryView = () => {
//   const { id } = useParams();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_BASE_URL}/posts?category_id=${id}`)
//       .then(res => res.json())
//       .then(result => { setPosts(result.data || []); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, [id]);

//   if (loading) return <div className="loader-container"><Loader2 className="spin" size={40} /></div>;

//   return (
//     <div className="animate-fade" style={{ paddingTop: '40px' }}>
//       <h2 style={{ marginBottom: '32px', fontSize: '2.2rem', fontWeight: 900 }}>Chuyên mục: {posts[0]?.category?.name || '...'}</h2>
//       <div className="post-grid">
//         {posts.map(p => <PostCard key={p.id} post={p} />)}
//       </div>
//       {posts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có bài viết nào trong chuyên mục này.</p>}
//     </div>
//   );
// };

// const DetailView = ({ isLoggedIn }) => {
//   const { slug } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/posts/detail/${slug}`)
//       .then(res => res.json())
//       .then(result => { setPost(result.data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, [slug]);

//   if (loading) return <div className="loader-container"><Loader2 className="spin" /></div>;
//   if (!post) return <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}><h2>Bài viết không tồn tại.</h2><Link to="/">Quay về trang chủ</Link></div>;

//   return (
//     <div className="detail-view animate-fade">
//       <button onClick={() => navigate(-1)} className="btn-outline">
//         <ChevronLeft size={18} /> Quay lại
//       </button>
//       <img src={getImageUrl(post.image)} className="detail-banner" alt={post.title} />
//       <h1 className="detail-title">{post.title}</h1>
//       <div style={{ display: 'flex', gap: '15px', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
//         <span>Tác giả: <strong>{post.author}</strong></span>
//         <span>•</span>
//         <span>Ngày: {post.created_at?.split('T')[0]}</span>
//       </div>
//       <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
//       {isLoggedIn && (
//         <button onClick={() => navigate(`/editor/${post.id}`)} className="btn-primary" style={{ marginTop: '40px' }}>
//           <Edit size={16} /> Sửa bài viết
//         </button>
//       )}
//     </div>
//   );
// };

// const LoginPage = ({ onLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
//       const result = await res.json();
//       if (res.ok) {
//         localStorage.setItem(STORAGE_KEY, result.data.access_token);
//         onLoginSuccess();
//         navigate('/');
//       } else { alert(result.message || 'Đăng nhập thất bại'); }
//     } catch (e) { alert('Lỗi kết nối'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="login-container animate-fade">
//       <form className="login-form" onSubmit={handleLogin}>
//         <div style={{ marginBottom: '20px' }}><Lock size={48} color="var(--primary)" style={{ margin: '0 auto' }} /></div>
//         <h2 style={{ marginBottom: '24px', fontWeight: 900 }}>Admin Access</h2>
//         <div className="form-group">
//           <label className="form-label">Email</label>
//           <input className="form-input" type="email" placeholder="admin@example.com" onChange={e => setEmail(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label className="form-label">Mật khẩu</label>
//           <input className="form-input" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} required />
//         </div>
//         <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
//           {loading ? <Loader2 className="spin" /> : 'Vào hệ thống'}
//         </button>
//       </form>
//     </div>
//   );
// };

// const EditorPage = ({ categories }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ title: '', excerpt: '', slug: '', content: '', category_id: 1, author: 'Admin' });
//   const [imageFile, setImageFile] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetch(`${API_BASE_URL}/posts/${id}`)
//         .then(res => res.json())
//         .then(result => setFormData(result.data));
//     }
//   }, [id]);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     const data = new FormData();
//     Object.keys(formData).forEach(key => data.append(key, formData[key]));
//     if (imageFile) data.append('image', imageFile);
//     if (id) data.append('_method', 'PUT');

//     try {
//       const res = await fetch(id ? `${API_BASE_URL}/posts/${id}` : `${API_BASE_URL}/posts`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
//         body: data
//       });
//       if (res.ok) navigate('/');
//       else alert("Không thể lưu bài viết.");
//     } catch (e) { alert("Lỗi kết nối"); }
//     finally { setIsSaving(false); }
//   };

//   return (
//     <div className="editor-container animate-fade">
//       <form onSubmit={handleSave}>
//         <h2 style={{ marginBottom: '32px', fontWeight: 900 }}>{id ? 'Cập nhật bài viết' : 'Viết bài mới'}</h2>
//         <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
//         <div className="form-group"><label className="form-label">Slug (URL tĩnh)</label><input className="form-input" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="vd: huong-dan-docker" required /></div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Chuyên mục</label>
//             <select className="form-select" value={formData.category_id} onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}>
//               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>
//           <div className="form-group"><label className="form-label">Tác giả</label><input className="form-input" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} /></div>
//         </div>
//         <div className="form-group"><label className="form-label">Tóm tắt (Excerpt)</label><textarea className="form-textarea" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} required /></div>
//         <div className="form-group"><label className="form-label">Ảnh bài viết</label><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!id} /></div>
//         <div className="form-group"><label className="form-label">Nội dung (HTML)</label><textarea className="form-textarea" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required style={{ minHeight: '350px' }} /></div>
//         <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSaving}>
//           {isSaving ? <Loader2 className="spin" /> : <Save size={18} />} Lưu bài viết
//         </button>
//       </form>
//     </div>
//   );
// };

// // ==========================================
// // 5. MAIN APP & ROUTING
// // ==========================================

// export default function App() {
//   const [categories, setCategories] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const styleSheet = document.createElement("style");
//     styleSheet.innerText = cssStyles;
//     document.head.appendChild(styleSheet);
//     if (localStorage.getItem(STORAGE_KEY)) setIsLoggedIn(true);
//     fetch(`${API_BASE_URL}/categories`).then(res => res.json()).then(result => setCategories(result.data || []));
//     return () => document.head.removeChild(styleSheet);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/logout`, { 
//         method: 'POST', 
//         headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` } 
//       });
//     } finally {
//       localStorage.removeItem(STORAGE_KEY);
//       setIsLoggedIn(false);
//       window.location.href = '/';
//     }
//   };

//   return (
//     <BrowserRouter>
//       <Navbar categories={categories} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
//       <div className="container" style={{ paddingBottom: '80px' }}>
//         <Routes>
//           <Route path="/" element={<HomeView />} />
//           <Route path="/category/:id" element={<CategoryView />} />
//           <Route path="/posts/:slug" element={<DetailView isLoggedIn={isLoggedIn} />} />
//           <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
//           <Route path="/editor" element={<EditorPage categories={categories} />} />
//           <Route path="/editor/:id" element={<EditorPage categories={categories} />} />
//           <Route path="/about" element={<div className="animate-fade" style={{ paddingTop: '80px', textAlign: 'center' }}><h1>About Me</h1><p>Full-stack Developer & DevOps Enthusiast.</p></div>} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }



import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import EditorPage from './pages/EditorPage';
import AboutPage from './pages/AboutPage';
import { API_BASE_URL, STORAGE_KEY } from './config/constants';

// Import CSS tổng hợp
import './assets/styles/index.css';
import CategoryManager from './pages/CategoryManager';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(result => setCategories(result.data || []));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Navbar categories={categories} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="container" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage categories={categories}/>} />
          <Route path="/posts/:slug" element={<DetailPage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/editor" element={<EditorPage categories={categories} />} />
          <Route path="/editor/:id" element={<EditorPage categories={categories} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/manage-categories" element={
            isLoggedIn ? <CategoryManager setCategories={setCategories} categories={categories} /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
import { useState, useEffect } from 'react';
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

import './assets/styles/index.css';
import CategoryManager from './pages/CategoryManager';
import SpaceBackground from './components/SpaceBackground';

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
      <SpaceBackground />
      <Navbar categories={categories} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="container" style={{ minHeight: '80vh', width: '90%' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage categories={categories} />} />
          <Route path="/posts/:slug" element={<DetailPage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/editor" element={<EditorPage categories={categories} />} />
          <Route path="/editor/:id" element={<EditorPage categories={categories} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/manage-categories" element={isLoggedIn ? <CategoryManager setCategories={setCategories}
            categories={categories} /> :
            <Navigate to="/login" />
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

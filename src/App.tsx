import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import EditorPage from './pages/EditorPage';
import AboutPage from './pages/AboutPage';
import CategoryManager from './pages/CategoryManager';
import SpaceBackground from './components/layout/SpaceBackground';
import { useAuthStore } from './stores';

import './assets/styles/index.css';

const App = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <BrowserRouter>
      <SpaceBackground />
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/posts/:slug" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/manage-categories"
            element={isLoggedIn ? <CategoryManager /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

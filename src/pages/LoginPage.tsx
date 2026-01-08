import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { API_BASE_URL, STORAGE_KEY } from '../config/constants';
import { LoginPageProps } from '../types';

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await res.json();
      if (result.status_code === 200) {
        localStorage.setItem(STORAGE_KEY, result.data.access_token);
        onLoginSuccess();
        navigate('/');
      } else {
        setError('Email or password is incorrect.');
      }
    } catch (err) {
      console.error("Lỗi thực thi:", err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-icon-wrapper">
          <Lock size={48} color="var(--primary)" className="login-icon" />
        </div>

        <h2 className="login-title">Login</h2>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="admin@example.com"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
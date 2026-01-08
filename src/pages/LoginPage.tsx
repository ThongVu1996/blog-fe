import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { authService } from '../services';
import { useAuthStore } from '../stores';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      login(result.user);
      navigate('/');
    } catch (err: any) {
      console.error("Lỗi thực thi:", err);
      setError(err.response?.data?.message || 'Email or password is incorrect.');
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center loginPage">
      <div className="card shadow-sm loginCard">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Sign in</h1>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input id="username" className="form-control" value={username} onChange={e=>setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100" disabled={loading || !username || !password}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">Don't have an account? <Link to="/register">Create one</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


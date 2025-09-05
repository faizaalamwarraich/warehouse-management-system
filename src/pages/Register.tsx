import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/ToastProvider';
import '../styles/pages/Register.css';

const Register: React.FC = () => {
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), password);
      toast.push('success', 'Registration successful. You can now sign in.');
      nav('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center registerPage">
      <div className="card shadow-sm registerCard">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Create an account</h1>
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
            <div className="mb-3">
              <label htmlFor="confirm" className="form-label">Confirm Password</label>
              <input id="confirm" type="password" className="form-control" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100" disabled={loading || !username || !password || !confirm}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">Already have an account? <Link to="/login">Sign in</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

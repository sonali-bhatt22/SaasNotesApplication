import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="app-shell">
      <div className="panel auth-card">
        <div className="auth-header">
          <h2 style={{ margin: 0 }}>Welcome back</h2>
          <div className="muted">Sign in to your account</div>
        </div>
        <div className="auth-body">
          <form onSubmit={handleSubmit} className="form">
            <div style={{ marginBottom: '14px' }}>
              <label>Email</label>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@acme.test"
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label>Password</label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="password"
              />
            </div>
            {error && (
              <div className="alert alert-error">{error}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            <div><b>Test accounts</b> (password: password)</div>
            <div>admin@acme.test, user@acme.test</div>
            <div>admin@globex.test, user@globex.test</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

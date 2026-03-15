import { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            if (user.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
                return;
            }
            onLogin(token, user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Eventify</h1>
                <p>Admin Panel — Sign in to continue</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@demo.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

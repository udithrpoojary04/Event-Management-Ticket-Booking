import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Users from './pages/Users';
import Bookings from './pages/Bookings';
import Feedback from './pages/Feedback';

function AdminLayout({ children, onLogout }) {
    return (
        <div className="admin-layout">
            <Sidebar onLogout={onLogout} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

function ProtectedRoute({ children, isAuthenticated, onLogout }) {
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        if (token && user) {
            const userData = JSON.parse(user);
            if (userData.role === 'admin') {
                setIsAuthenticated(true);
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = (token, user) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/events" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                        <Events />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                        <Users />
                    </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                        <Bookings />
                    </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                        <Feedback />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

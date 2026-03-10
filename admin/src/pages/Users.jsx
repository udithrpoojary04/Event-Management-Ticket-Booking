import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '../services/api';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading"><div className="spinner"></div>Loading users...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users</p>
                </div>
                <div className="search-bar">
                    <FiSearch size={16} />
                    <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user._id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '—'}</td>
                                    <td>{user.location || '—'}</td>
                                    <td><span className={`badge ${user.role}`}>{user.role}</span></td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

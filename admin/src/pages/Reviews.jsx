import { useState, useEffect } from 'react';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';

function StarRow({ rating }) {
    return (
        <span style={{ display: 'inline-flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(s => (
                <FiStar
                    key={s}
                    size={13}
                    style={{
                        fill: s <= rating ? '#f59e0b' : 'none',
                        color: s <= rating ? '#f59e0b' : '#cbd5e1',
                    }}
                />
            ))}
        </span>
    );
}

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(0); // 0 = all ratings
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete review');
        }
        setDeletingId(null);
    };

    const filtered = reviews.filter(r => {
        if (filter > 0 && r.rating !== filter) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                r.name?.toLowerCase().includes(q) ||
                r.comment?.toLowerCase().includes(q) ||
                r.event?.title?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '—';

    if (loading) return <div className="loading"><div className="spinner"></div>Loading reviews...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Reviews</h1>
                    <p>{reviews.length} total · avg rating {avgRating}</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by name, event or comment…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={inputStyle}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 5, 4, 3, 2, 1].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 500,
                                background: filter === s ? 'var(--accent)' : 'var(--bg-card)',
                                color: filter === s ? '#fff' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            {s === 0 ? 'All' : <><FiStar size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} /> {s}</>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating summary bar */}
            {reviews.length > 0 && (
                <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{avgRating}</div>
                        <StarRow rating={Math.round(parseFloat(avgRating))} />
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{reviews.length} reviews</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        {[5, 4, 3, 2, 1].map(s => {
                            const count = reviews.filter(r => r.rating === s).length;
                            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                            return (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 10 }}>{s}</span>
                                    <FiStar size={12} style={{ fill: '#f59e0b', color: '#f59e0b', flexShrink: 0 }} />
                                    <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 4, transition: 'width .4s' }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 24, textAlign: 'right' }}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reviews table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Event</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: 'linear-gradient(135deg,#6366f1,#d946ef)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                                            }}>
                                                {r.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 160 }}>
                                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {r.event?.title || '—'}
                                        </span>
                                    </td>
                                    <td><StarRow rating={r.rating} /></td>
                                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 300 }}>
                                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {r.comment}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(r._id)}
                                            disabled={deletingId === r._id}
                                            style={{
                                                border: 'none', background: 'rgba(239,68,68,.1)', color: '#ef4444',
                                                borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
                                                opacity: deletingId === r._id ? .5 : 1,
                                            }}
                                            title="Delete review"
                                        >
                                            <FiTrash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                                        No reviews found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: 13,
    flex: 1,
    minWidth: 220,
    outline: 'none',
};

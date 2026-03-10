import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchFeedback(); }, []);

    const fetchFeedback = async () => {
        try {
            const res = await api.get('/feedback');
            setFeedbacks(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    if (loading) return <div className="loading"><div className="spinner"></div>Loading feedback...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Feedback</h1>
                    <p>View feedback messages from users</p>
                </div>
            </div>

            <div className="feedback-grid">
                {feedbacks.map(fb => (
                    <div key={fb._id} className="feedback-card">
                        <div className="meta">
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{fb.name}</strong>
                                <span style={{ margin: '0 8px' }}>•</span>
                                <span>{fb.email}</span>
                            </div>
                            <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="message">{fb.message}</div>
                    </div>
                ))}
                {feedbacks.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                        No feedback messages yet
                    </div>
                )}
            </div>
        </div>
    );
}

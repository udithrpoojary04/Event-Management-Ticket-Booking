import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '../services/api';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/admin/bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const filtered = bookings.filter(b =>
        b.eventTitle?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.ticketType?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading"><div className="spinner"></div>Loading bookings...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Bookings</h1>
                    <p>View all bookings on the platform</p>
                </div>
                <div className="search-bar">
                    <FiSearch size={16} />
                    <input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>User</th>
                                <th>Ticket Type</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(booking => (
                                <tr key={booking._id}>
                                    <td style={{ fontWeight: 500 }}>{booking.eventTitle}</td>
                                    <td>{booking.user?.name || 'N/A'}</td>
                                    <td>{booking.ticketType}</td>
                                    <td>{booking.quantity}</td>
                                    <td>₹{booking.grandTotal?.toFixed(2)}</td>
                                    <td>{booking.paymentMethod}</td>
                                    <td><span className={`badge ${booking.status}`}>{booking.status}</span></td>
                                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No bookings found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../services/api';

const emptyEvent = {
    title: '', description: '', category: 'Music', date: '', time: '',
    endDate: '', location: '', venue: '', city: '', image: '',
    organizer: '', totalCapacity: 0, featured: false, tags: '',
    tickets: [{ type: 'General', price: 0, available: 0 }],
};

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...emptyEvent });

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...form,
                tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
            };
            if (editing) {
                await api.put(`/events/${editing}`, data);
            } else {
                await api.post('/events', data);
            }
            setShowModal(false);
            setEditing(null);
            setForm({ ...emptyEvent });
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEdit = (event) => {
        setEditing(event._id);
        setForm({
            ...event,
            tags: Array.isArray(event.tags) ? event.tags.join(', ') : event.tags,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    const addTicket = () => {
        setForm(f => ({ ...f, tickets: [...f.tickets, { type: '', price: 0, available: 0 }] }));
    };

    const updateTicket = (idx, field, val) => {
        setForm(f => {
            const tickets = [...f.tickets];
            tickets[idx] = { ...tickets[idx], [field]: field === 'type' ? val : Number(val) };
            return { ...f, tickets };
        });
    };

    const removeTicket = (idx) => {
        setForm(f => ({ ...f, tickets: f.tickets.filter((_, i) => i !== idx) }));
    };

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading"><div className="spinner"></div>Loading events...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Events</h1>
                    <p>Manage all events on the platform</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="search-bar">
                        <FiSearch size={16} />
                        <input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ ...emptyEvent }); setShowModal(true); }}>
                        <FiPlus /> Add Event
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>City</th>
                                <th>Capacity</th>
                                <th>Sold</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(event => (
                                <tr key={event._id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {event.image && <img src={event.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                                        <span style={{ fontWeight: 500 }}>{event.title}</span>
                                    </td>
                                    <td>{event.category}</td>
                                    <td>{event.date}</td>
                                    <td>{event.city}</td>
                                    <td>{event.totalCapacity?.toLocaleString()}</td>
                                    <td>{event.sold?.toLocaleString()}</td>
                                    <td>{event.featured ? '⭐' : '—'}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleEdit(event)}><FiEdit2 /></button>
                                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(event._id)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No events found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? 'Edit Event' : 'Create Event'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {['Music', 'Technology', 'Food & Drink', 'Arts', 'Sports', 'Business', 'Education'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>Venue</label>
                                    <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Organizer</label>
                                    <input value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 10 }}>
                                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 18, height: 18 }} />
                                    <label style={{ margin: 0 }}>Featured</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="music, festival, outdoor" />
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <label style={{ fontWeight: 600, fontSize: 14 }}>Tickets</label>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={addTicket}><FiPlus size={14} /> Add Ticket</button>
                                </div>
                                {form.tickets.map((t, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                                        <input placeholder="Type" value={t.type} onChange={e => updateTicket(i, 'type', e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 13 }} />
                                        <input type="number" placeholder="Price" value={t.price} onChange={e => updateTicket(i, 'price', e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 13 }} />
                                        <input type="number" placeholder="Available" value={t.available} onChange={e => updateTicket(i, 'available', e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 13 }} />
                                        {form.tickets.length > 1 && <button type="button" className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => removeTicket(i)}><FiTrash2 size={14} /></button>}
                                    </div>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

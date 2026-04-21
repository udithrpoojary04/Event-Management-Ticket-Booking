import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUpload } from 'react-icons/fi';
import api from '../services/api';

const emptyEvent = {
    title: '', description: '', category: 'Music', date: '', time: '',
    endDate: '', venue: '', organizer: '', featured: false,
    tickets: [{ type: 'General', price: 0, available: 0 }],
    imageFile: null,
};
const today = new Date().toISOString().split('T')[0];
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrow = tomorrowDate.toISOString().split('T')[0];

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...emptyEvent });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(f => ({ ...f, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('date', form.date);
            formData.append('time', form.time);
            formData.append('endDate', form.endDate || '');
            formData.append('venue', form.venue || '');
            formData.append('organizer', form.organizer || '');
            formData.append('featured', form.featured);
            formData.append('tickets', JSON.stringify(form.tickets));

            if (form.imageFile) {
                formData.append('image', form.imageFile);
            }

            if (editing) {
                await api.put(`/events/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/events', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            setShowModal(false);
            setEditing(null);
            setForm({ ...emptyEvent });
            setImagePreview(null);
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEdit = (event) => {
        setEditing(event._id);
        setForm({
            title: event.title || '',
            description: event.description || '',
            category: event.category || 'Music',
            date: event.date || '',
            time: event.time || '',
            endDate: event.endDate || '',
            venue: event.venue || '',
            organizer: event.organizer || '',
            featured: event.featured || false,
            tickets: event.tickets || [{ type: 'General', price: 0, available: 0 }],
            imageFile: null,
        });
        // Show existing image as preview
        if (event.image) {
            const baseUrl = api.defaults.baseURL.replace('/api', '');
            setImagePreview(event.image.startsWith('http') ? event.image : `${baseUrl}${event.image}`);
        } else {
            setImagePreview(null);
        }
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
                    <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ ...emptyEvent }); setImagePreview(null); setShowModal(true); }}>
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
                                <th>Capacity</th>
                                <th>Sold</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(event => (
                                <tr key={event._id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {event.image && <img src={event.image.startsWith('http') ? event.image : `${api.defaults.baseURL.replace('/api', '')}${event.image}`} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                                        <span style={{ fontWeight: 500 }}>{event.title}</span>
                                    </td>
                                    <td>{event.category}</td>
                                    <td>{event.date}</td>
                                    <td>{event.totalCapacity?.toLocaleString()}</td>
                                    <td>{event.sold?.toLocaleString()}</td>
                                    <td>
                                        {new Date(`${event.endDate || event.date}T${event.time || '23:59'}`) < new Date() ? (
                                            <span style={{ padding: '4px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 600 }}>Completed</span>
                                        ) : (
                                            <span style={{ padding: '4px 8px', borderRadius: 4, background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 600 }}>Upcoming</span>
                                        )}
                                    </td>
                                    <td>{event.featured ? '⭐' : '—'}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleEdit(event)}><FiEdit2 /></button>
                                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(event._id)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No events found</td></tr>
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
                            <div className="form-group">
                                <label>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {['Music', 'Technology', 'Food & Drink', 'Arts', 'Sports', 'Business', 'Education'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={form.date} min={tomorrow} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" value={form.endDate} min={form.date || tomorrow} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Venue</label>
                                <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Image (PNG, JPEG, JPG only)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <label style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '8px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                                        borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)', fontSize: 13,
                                        transition: 'border-color 0.2s',
                                    }}>
                                        <FiUpload size={16} />
                                        Choose Image
                                        <input
                                            type="file"
                                            accept=".png,.jpeg,.jpg"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    {form.imageFile && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.imageFile.name}</span>}
                                </div>
                                {imagePreview && (
                                    <div style={{ marginTop: 8 }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }} />
                                    </div>
                                )}
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

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <label style={{ fontWeight: 600, fontSize: 14 }}>Tickets</label>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Type</span>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Price</span>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Capacity</span>
                                    <span></span>
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

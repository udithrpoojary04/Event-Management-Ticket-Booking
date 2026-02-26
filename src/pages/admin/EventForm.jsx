import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, createEvent, updateEvent } from '../../services/events';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateRequired, validatePrice, validateUrl } from '../../utils/validators';
import {
    HiPhoto,
    HiCalendar,
    HiMapPin,
    HiCurrencyDollar,
    HiPlus,
    HiTrash,
    HiArrowLeft,
    HiCheckCircle,
} from 'react-icons/hi2';

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Music',
        date: '',
        time: '',
        endDate: '',
        location: '',
        venue: '',
        city: '',
        image: '',
        tickets: [{ type: 'General', price: '', available: '' }],
        totalCapacity: '',
    });

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            getEventById(id)
                .then(res => {
                    const e = res.data;
                    setForm({
                        title: e.title,
                        description: e.description,
                        category: e.category,
                        date: e.date,
                        time: e.time,
                        endDate: e.endDate,
                        location: e.location,
                        venue: e.venue || '',
                        city: e.city || '',
                        image: e.image,
                        tickets: e.tickets.map(t => ({ type: t.type, price: t.price.toString(), available: t.available.toString() })),
                        totalCapacity: e.totalCapacity.toString(),
                    });
                })
                .catch(() => {
                    toast.error('Event not found');
                    navigate('/admin/events');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleTicketChange = (idx, field, value) => {
        const updated = [...form.tickets];
        updated[idx][field] = value;
        setForm(prev => ({ ...prev, tickets: updated }));
    };

    const addTicket = () => {
        setForm(prev => ({
            ...prev,
            tickets: [...prev.tickets, { type: '', price: '', available: '' }],
        }));
    };

    const removeTicket = (idx) => {
        if (form.tickets.length <= 1) return;
        setForm(prev => ({
            ...prev,
            tickets: prev.tickets.filter((_, i) => i !== idx),
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (validateRequired(form.title, 'Title')) newErrors.title = validateRequired(form.title, 'Title');
        if (validateRequired(form.description, 'Description')) newErrors.description = validateRequired(form.description, 'Description');
        if (validateRequired(form.date, 'Date')) newErrors.date = validateRequired(form.date, 'Date');
        if (validateRequired(form.location, 'Location')) newErrors.location = validateRequired(form.location, 'Location');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            const payload = {
                ...form,
                tickets: form.tickets.map(t => ({ type: t.type, price: parseFloat(t.price), available: parseInt(t.available) })),
                totalCapacity: parseInt(form.totalCapacity),
            };
            if (isEditing) {
                await updateEvent(id, payload);
                toast.success('Event updated successfully!');
            } else {
                await createEvent(payload);
                toast.success('Event created successfully!');
            }
            navigate('/admin/events');
        } catch (err) {
            toast.error('Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    const categories = ['Music', 'Technology', 'Food & Drink', 'Arts', 'Sports', 'Business', 'Education'];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 shimmer-bg rounded w-48" />
                <div className="card p-6 space-y-4">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-12 shimmer-bg rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/events')} className="p-2 hover:bg-surface-100 rounded-xl transition-all" aria-label="Go back">
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
                    <p className="text-sm text-surface-500">{isEditing ? 'Update event details' : 'Fill in the details for your new event'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="card p-6">
                    <h2 className="font-bold text-surface-900 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <Input label="Event Title" name="title" value={form.title} onChange={handleChange} error={errors.title} placeholder="Enter event title" required />
                        <div>
                            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                                placeholder="Describe your event..."
                            />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-1.5">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Input label="Total Capacity" type="number" name="totalCapacity" value={form.totalCapacity} onChange={handleChange} placeholder="5000" />
                        </div>
                    </div>
                </div>

                {/* Date & Location */}
                <div className="card p-6">
                    <h2 className="font-bold text-surface-900 mb-4">Date & Location</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Start Date" type="date" name="date" value={form.date} onChange={handleChange} error={errors.date} required icon={HiCalendar} />
                        <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} icon={HiCalendar} />
                        <Input label="Time" type="time" name="time" value={form.time} onChange={handleChange} />
                        <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                        <Input label="Venue" name="venue" value={form.venue} onChange={handleChange} placeholder="Madison Square Garden" icon={HiMapPin} />
                        <Input label="Full Address" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="Full event address" required icon={HiMapPin} />
                    </div>
                </div>

                {/* Image */}
                <div className="card p-6">
                    <h2 className="font-bold text-surface-900 mb-4">Event Image</h2>
                    <Input label="Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" icon={HiPhoto} />
                    {form.image && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-surface-100">
                            <img src={form.image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                    )}
                </div>

                {/* Tickets */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-surface-900">Ticket Types</h2>
                        <Button type="button" variant="ghost" size="sm" icon={HiPlus} onClick={addTicket}>
                            Add Ticket
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {form.tickets.map((ticket, idx) => (
                            <div key={idx} className="flex items-end gap-3 p-4 bg-surface-50 rounded-xl">
                                <div className="flex-1">
                                    <Input label="Type" value={ticket.type} onChange={(e) => handleTicketChange(idx, 'type', e.target.value)} placeholder="VIP" />
                                </div>
                                <div className="w-32">
                                    <Input label="Price ($)" type="number" value={ticket.price} onChange={(e) => handleTicketChange(idx, 'price', e.target.value)} placeholder="99" icon={HiCurrencyDollar} />
                                </div>
                                <div className="w-28">
                                    <Input label="Available" type="number" value={ticket.available} onChange={(e) => handleTicketChange(idx, 'available', e.target.value)} placeholder="100" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTicket(idx)}
                                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all mb-0.5"
                                    disabled={form.tickets.length <= 1}
                                    aria-label="Remove ticket type"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <Button type="submit" size="lg" loading={saving} icon={HiCheckCircle}>
                        {isEditing ? 'Update Event' : 'Create Event'}
                    </Button>
                    <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/admin/events')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;

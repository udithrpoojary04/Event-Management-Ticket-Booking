import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../services/events';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import {
    HiPlus,
    HiPencilSquare,
    HiTrash,
    HiMagnifyingGlass,
    HiCalendarDays,
    HiEye,
} from 'react-icons/hi2';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ open: false, event: null });
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const eventsPerPage = 6;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await getEvents();
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteEvent(deleteModal.event._id);
            setEvents(prev => prev.filter(e => e._id !== deleteModal.event._id));
            toast.success('Event deleted successfully');
            setDeleteModal({ open: false, event: null });
        } catch (err) {
            toast.error('Failed to delete event');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / eventsPerPage);
    const paginated = filtered.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Events</h1>
                    <p className="text-surface-500 text-sm">{events.length} total events</p>
                </div>
                <Button icon={HiPlus} onClick={() => navigate('/admin/events/new')}>
                    Create Event
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search events..."
                    className="input-field !pl-10 !py-2.5 text-sm"
                    aria-label="Search events"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="card overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-surface-50">
                            <div className="w-16 h-12 shimmer-bg rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 shimmer-bg rounded w-1/2" />
                                <div className="h-3 shimmer-bg rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginated.length > 0 ? (
                <>
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm" aria-label="Events list">
                                <thead className="bg-surface-50 border-b border-surface-100">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-semibold text-surface-600">Event</th>
                                        <th className="text-left px-4 py-3 font-semibold text-surface-600 hidden md:table-cell">Category</th>
                                        <th className="text-left px-4 py-3 font-semibold text-surface-600 hidden sm:table-cell">Date</th>
                                        <th className="text-left px-4 py-3 font-semibold text-surface-600 hidden lg:table-cell">Price</th>
                                        <th className="text-left px-4 py-3 font-semibold text-surface-600 hidden lg:table-cell">Sold</th>
                                        <th className="text-right px-4 py-3 font-semibold text-surface-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-50">
                                    {paginated.map((event) => (
                                        <tr key={event._id} className="hover:bg-surface-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={event.image} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-surface-900 truncate max-w-[200px]">{event.title}</p>
                                                        <p className="text-xs text-surface-400 truncate">{event.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className="badge-primary text-xs">{event.category}</span>
                                            </td>
                                            <td className="px-4 py-3 text-surface-600 hidden sm:table-cell">{formatDateShort(event.date)}</td>
                                            <td className="px-4 py-3 font-medium text-surface-900 hidden lg:table-cell">
                                                {formatCurrency(Math.min(...event.tickets.map(t => t.price)))}
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-surface-100 rounded-full h-1.5">
                                                        <div
                                                            className="gradient-bg h-full rounded-full"
                                                            style={{ width: `${(event.sold / event.totalCapacity) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-surface-500">{Math.round((event.sold / event.totalCapacity) * 100)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        to={`/events/${event._id}`}
                                                        className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                        aria-label={`View ${event.title}`}
                                                    >
                                                        <HiEye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                                                        className="p-2 text-surface-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        aria-label={`Edit ${event.title}`}
                                                    >
                                                        <HiPencilSquare className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, event })}
                                                        className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        aria-label={`Delete ${event.title}`}
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />
                </>
            ) : (
                <EmptyState
                    icon={HiCalendarDays}
                    title="No events found"
                    description={search ? 'No events match your search' : 'Create your first event to get started'}
                    actionLabel="Create Event"
                    onAction={() => navigate('/admin/events/new')}
                />
            )}

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, event: null })} title="Delete Event" size="sm">
                <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <HiTrash className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-surface-700 mb-1">Are you sure you want to delete</p>
                    <p className="font-bold text-surface-900 mb-4">"{deleteModal.event?.title}"?</p>
                    <p className="text-sm text-surface-500 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="ghost" onClick={() => setDeleteModal({ open: false, event: null })}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete} loading={deleting} icon={HiTrash}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EventList;

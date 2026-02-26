import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById } from '../../services/events';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import {
    HiCalendar,
    HiMapPin,
    HiClock,
    HiUserGroup,
    HiStar,
    HiTicket,
    HiArrowLeft,
    HiHeart,
    HiShare,
    HiMinus,
    HiPlus,
} from 'react-icons/hi2';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await getEventById(id);
                setEvent(res.data);
                setSelectedTicket(res.data.tickets[0]);
            } catch (err) {
                toast.error('Event not found');
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.warning('Please sign in to book tickets');
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }
        navigate('/booking', {
            state: {
                event,
                ticket: selectedTicket,
                quantity,
            },
        });
    };

    const serviceFee = selectedTicket ? (selectedTicket.price * quantity * 0.05) : 0;
    const total = selectedTicket ? (selectedTicket.price * quantity + serviceFee) : 0;

    if (loading) {
        return (
            <div className="page-container py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 shimmer-bg rounded w-32" />
                    <div className="h-80 shimmer-bg rounded-2xl" />
                    <div className="h-8 shimmer-bg rounded w-3/4" />
                    <div className="h-4 shimmer-bg rounded w-1/2" />
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="animate-fade-in">
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80 lg:h-[420px]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Back button */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
                        aria-label="Go back"
                    >
                        <HiArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setLiked(!liked); toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist'); }}
                            className={`p-2.5 rounded-xl backdrop-blur-sm transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <HiHeart className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                            className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                            aria-label="Share event"
                        >
                            <HiShare className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Event title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="page-container">
                        <span className="badge bg-white/20 backdrop-blur-sm text-white text-xs mb-3">{event.category}</span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{event.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-1.5">
                                <HiCalendar className="w-4 h-4" /> {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <HiClock className="w-4 h-4" /> {formatTime(event.time)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <HiMapPin className="w-4 h-4" /> {event.location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-container py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left - Details */}
                    <div className="flex-1">
                        {/* Quick stats */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                                <HiStar className="w-5 h-5 text-amber-500" />
                                <span className="font-semibold text-surface-900">{event.rating}</span>
                                <span className="text-sm text-surface-500">({event.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-xl">
                                <HiUserGroup className="w-5 h-5 text-primary-500" />
                                <span className="text-sm text-surface-700">{event.sold.toLocaleString()} attending</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                                <HiTicket className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm text-surface-700">{(event.totalCapacity - event.sold).toLocaleString()} spots left</span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-surface-900 mb-4">About This Event</h2>
                            <p className="text-surface-600 leading-relaxed">{event.description}</p>
                        </div>

                        {/* Organizer */}
                        <div className="card p-6 mb-10">
                            <h2 className="text-lg font-bold text-surface-900 mb-4">Organized By</h2>
                            <div className="flex items-center gap-4">
                                <img src={event.organizerAvatar} alt={event.organizer} className="w-14 h-14 rounded-xl" />
                                <div>
                                    <h3 className="font-semibold text-surface-900">{event.organizer}</h3>
                                    <p className="text-sm text-surface-500">Event Organizer</p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket pricing table */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-surface-900 mb-4">Ticket Pricing</h2>
                            <div className="card overflow-hidden">
                                <table className="w-full" aria-label="Ticket pricing breakdown">
                                    <thead className="bg-surface-50">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-surface-600">Ticket Type</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-surface-600">Price</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-surface-600">Available</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-surface-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100">
                                        {event.tickets.map((ticket, i) => (
                                            <tr
                                                key={i}
                                                className={`cursor-pointer transition-colors ${selectedTicket?.type === ticket.type
                                                        ? 'bg-primary-50'
                                                        : 'hover:bg-surface-50'
                                                    }`}
                                                onClick={() => setSelectedTicket(ticket)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTicket?.type === ticket.type ? 'border-primary-600' : 'border-surface-300'
                                                            }`}>
                                                            {selectedTicket?.type === ticket.type && (
                                                                <div className="w-2 h-2 rounded-full gradient-bg" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-surface-900">{ticket.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-surface-900">{formatCurrency(ticket.price)}</td>
                                                <td className="px-6 py-4 text-surface-500">{ticket.available}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${ticket.available > 50 ? 'badge-success' : ticket.available > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                                        {ticket.available > 50 ? 'Available' : ticket.available > 0 ? 'Limited' : 'Sold Out'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h2 className="text-lg font-bold text-surface-900 mb-3">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 bg-surface-100 text-surface-600 text-sm rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Booking Panel */}
                    <div className="lg:w-96">
                        <div className="card p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-surface-900 mb-6">Booking Summary</h3>

                            {/* Selected ticket */}
                            {selectedTicket && (
                                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-primary-600 font-medium">{selectedTicket.type}</p>
                                    <p className="text-2xl font-bold text-surface-900 mt-1">{formatCurrency(selectedTicket.price)}</p>
                                    <p className="text-xs text-surface-500">per ticket</p>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-surface-700 mb-2">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-all"
                                        aria-label="Decrease quantity"
                                    >
                                        <HiMinus className="w-4 h-4" />
                                    </button>
                                    <span className="text-xl font-bold text-surface-900 w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                                        className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-all"
                                        aria-label="Increase quantity"
                                    >
                                        <HiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-3 py-4 border-t border-surface-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-500">Subtotal ({quantity}× {selectedTicket?.type})</span>
                                    <span className="text-surface-700">{formatCurrency(selectedTicket?.price * quantity || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-500">Service Fee (5%)</span>
                                    <span className="text-surface-700">{formatCurrency(serviceFee)}</span>
                                </div>
                                <hr className="border-surface-100" />
                                <div className="flex justify-between">
                                    <span className="font-bold text-surface-900">Total</span>
                                    <span className="font-bold text-xl gradient-text">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleBookNow}
                                className="w-full mt-4"
                                size="lg"
                                icon={HiTicket}
                            >
                                Book Now
                            </Button>

                            <p className="text-xs text-center text-surface-400 mt-4">
                                Free cancellation up to 48 hours before the event
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, getEventReviews, submitReview } from '../../services/events';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { resolveMediaUrl } from '../../utils/media';
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
    HiPencil,
    HiCheckCircle,
} from 'react-icons/hi2';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const toast = useToast();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReview, setUserReview] = useState(null);

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

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await getEventReviews(id);
                setReviews(res.data);
                if (user) {
                    const uid = user._id?.toString() || user.id?.toString();
                    const mine = res.data.find(r => r.user?.toString() === uid);
                    if (mine) {
                        setUserReview(mine);
                        setReviewForm({ rating: mine.rating, comment: mine.comment });
                    }
                }
            } catch {
                // non-fatal
            }
        };
        fetchReviews();
    }, [id, user]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.rating) {
            toast.warning('Please select a star rating');
            return;
        }
        setSubmittingReview(true);
        try {
            const res = await submitReview(id, reviewForm);
            const updated = res.data;
            setReviews(prev => {
                const without = prev.filter(r => r._id !== updated._id);
                return [updated, ...without];
            });
            setUserReview(updated);
            // Refresh event to get updated aggregated rating
            const evRes = await getEventById(id);
            setEvent(evRes.data);
            toast.success(userReview ? 'Review updated!' : 'Review submitted!');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to submit review';
            toast.error(msg);
        } finally {
            setSubmittingReview(false);
        }
    };

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
            {/* Hero Image  */}
            <div className="relative h-64 sm:h-80 lg:h-[420px]">
                <img src={resolveMediaUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
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
                                <img src={resolveMediaUrl(event.organizerAvatar)} alt={event.organizer} className="w-14 h-14 rounded-xl" />
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

                        {/* Reviews */}
                        <div className="mt-10">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-xl font-bold text-surface-900">Reviews</h2>
                                <span className="px-2.5 py-0.5 bg-surface-100 text-surface-600 text-sm rounded-full">
                                    {event.reviews} {event.reviews === 1 ? 'review' : 'reviews'}
                                </span>
                                {event.reviews > 0 && (
                                    <div className="flex items-center gap-1 ml-1">
                                        <HiStar className="w-4 h-4 text-amber-400" />
                                        <span className="font-semibold text-surface-900">{event.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Rating distribution */}
                            {event.reviews > 0 && (
                                <div className="card p-5 mb-6">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = reviews.filter(r => r.rating === star).length;
                                        const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-3 mb-2 last:mb-0">
                                                <span className="text-sm text-surface-500 w-3">{star}</span>
                                                <HiStar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                                <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-surface-400 w-8 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Submit review form */}
                            {isAuthenticated ? (
                                <div className="card p-6 mb-6">
                                    <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                                        {userReview ? (
                                            <><HiPencil className="w-4 h-4 text-primary-500" /> Edit Your Review</>
                                        ) : (
                                            <><HiStar className="w-4 h-4 text-amber-400" /> Write a Review</>
                                        )}
                                    </h3>
                                    <form onSubmit={handleSubmitReview}>
                                        {/* Star selector */}
                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(s)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                                                    className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                                                    aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                                                >
                                                    <HiStar
                                                        className={`w-8 h-8 transition-colors ${(hoverRating || reviewForm.rating) >= s ? 'text-amber-400' : 'text-surface-200'}`}
                                                    />
                                                </button>
                                            ))}
                                            {(hoverRating || reviewForm.rating) > 0 && (
                                                <span className="ml-2 text-sm text-surface-500">
                                                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoverRating || reviewForm.rating]}
                                                </span>
                                            )}
                                        </div>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Share your experience about this event..."
                                            rows={3}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm text-surface-800 resize-none"
                                        />
                                        <Button
                                            type="submit"
                                            className="mt-3"
                                            loading={submittingReview}
                                            icon={userReview ? HiPencil : HiCheckCircle}
                                            size="sm"
                                        >
                                            {userReview ? 'Update Review' : 'Submit Review'}
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <div className="card p-5 mb-6 text-center border-dashed">
                                    <p className="text-surface-500 text-sm">
                                        <button onClick={() => navigate('/login', { state: { from: `/events/${id}` } })} className="text-primary-600 font-semibold hover:underline">Sign in</button>
                                        {' '}to leave a review
                                    </p>
                                </div>
                            )}

                            {/* Reviews list */}
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review._id} className="card p-5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                        {review.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-surface-900 text-sm">{review.name}</p>
                                                        <p className="text-xs text-surface-400">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <HiStar key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400' : 'text-surface-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-surface-600 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-surface-400 text-sm text-center py-8">No reviews yet. Be the first to share your experience!</p>
                            )}
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
                                        onClick={() => setQuantity(q => Math.min(selectedTicket?.available || 1, q + 1))}
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

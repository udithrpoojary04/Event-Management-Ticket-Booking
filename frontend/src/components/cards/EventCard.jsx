import { Link } from 'react-router-dom';
import { HiCalendar, HiMapPin, HiTicket, HiStar } from 'react-icons/hi2';
import { formatDateShort, formatCurrency } from '../../utils/formatters';
import { resolveMediaUrl } from '../../utils/media';
import { isEventPast } from '../../utils/eventStatus';

const EventCard = ({ event, className = '' }) => {
    const eventId = event?._id || event?.id;
    const tickets = Array.isArray(event?.tickets) ? event.tickets : [];
    const prices = tickets
        .map((ticket) => Number(ticket?.price))
        .filter((price) => Number.isFinite(price));
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const sold = Number.isFinite(Number(event?.sold)) ? Number(event.sold) : 0;
    const totalCapacity = Number.isFinite(Number(event?.totalCapacity)) && Number(event.totalCapacity) > 0
        ? Number(event.totalCapacity)
        : 0;
    const soldPercent = totalCapacity > 0
        ? Math.min(100, Math.max(0, Math.round((sold / totalCapacity) * 100)))
        : 0;

    const isPast = isEventPast(event);

    const locationText = event?.location || event?.venue || 'Location TBA';

    return (
        <Link
            to={eventId ? `/events/${eventId}` : '/events'}
            className={`card-hover group block overflow-hidden ${className}`}
            aria-label={`View details for ${event.title}`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={resolveMediaUrl(event.image)}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isPast ? 'grayscale-[0.5] opacity-75' : ''}`}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status Badge */}
                {isPast && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20 shadow-xl">
                            Event Completed
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                <span className="absolute top-3 left-3 badge-primary text-xs backdrop-blur-sm bg-primary-500/90 text-white">
                    {event.category}
                </span>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                    <HiStar className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-white font-medium">{event.rating}</span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3">
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                        {formatCurrency(lowestPrice)}
                    </span>
                    <span className="text-white/70 text-xs block text-right">from</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-surface-900 text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-surface-500 text-sm">
                        <HiCalendar className="w-4 h-4 text-primary-400 flex-shrink-0" />
                        <span>{formatDateShort(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500 text-sm">
                        <HiMapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                        <span className="line-clamp-1">{locationText}</span>
                    </div>
                </div>

                {/* Capacity bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-surface-500 flex items-center gap-1">
                            <HiTicket className="w-3.5 h-3.5" />
                            {sold.toLocaleString()} sold
                        </span>
                        <span className={`font-semibold ${soldPercent > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {soldPercent > 80 ? 'Selling Fast!' : `${100 - soldPercent}% left`}
                        </span>
                    </div>
                    <div className="w-full bg-surface-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${soldPercent > 80
                                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                                    : 'bg-gradient-to-r from-primary-400 to-accent-400'
                                }`}
                            style={{ width: `${soldPercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;

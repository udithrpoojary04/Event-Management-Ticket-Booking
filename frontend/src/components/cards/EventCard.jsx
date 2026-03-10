import { Link } from 'react-router-dom';
import { HiCalendar, HiMapPin, HiTicket, HiStar } from 'react-icons/hi2';
import { formatDateShort, formatCurrency } from '../../utils/formatters';

const EventCard = ({ event, className = '' }) => {
    const lowestPrice = Math.min(...event.tickets.map(t => t.price));
    const soldPercent = Math.round((event.sold / event.totalCapacity) * 100);

    return (
        <Link
            to={`/events/${event._id}`}
            className={`card-hover group block overflow-hidden ${className}`}
            aria-label={`View details for ${event.title}`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                </div>

                {/* Capacity bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-surface-500 flex items-center gap-1">
                            <HiTicket className="w-3.5 h-3.5" />
                            {event.sold.toLocaleString()} sold
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

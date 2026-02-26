import { useState, useEffect } from 'react';
import { getBookings } from '../../services/bookings';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';
import QRCode from '../../components/common/QRCode';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import {
    HiTicket,
    HiCalendar,
    HiMapPin,
    HiEye,
    HiArrowDownTray,
    HiMagnifyingGlass,
} from 'react-icons/hi2';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getBookings();
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b => {
        if (filter !== 'all' && b.status !== filter) return false;
        if (search && !b.eventTitle.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const viewTicket = (booking) => {
        setSelectedBooking(booking);
        setShowTicketModal(true);
    };

    if (loading) {
        return (
            <div className="py-10 page-container max-w-5xl">
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card p-6">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 shimmer-bg rounded-xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 shimmer-bg rounded w-3/4" />
                                    <div className="h-4 shimmer-bg rounded w-1/2" />
                                    <div className="h-4 shimmer-bg rounded w-1/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 animate-fade-in">
            <div className="page-container max-w-5xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-surface-900">My Bookings</h1>
                        <p className="text-surface-500">{bookings.length} total bookings</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search bookings..."
                            className="input-field !pl-10 !py-2.5 text-sm"
                            aria-label="Search bookings"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'confirmed', 'pending', 'completed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'gradient-bg text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings list */}
                {filteredBookings.length > 0 ? (
                    <div className="space-y-4">
                        {filteredBookings.map((booking, i) => (
                            <div
                                key={booking.id}
                                className="card p-4 sm:p-6 animate-fade-in-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <img
                                        src={booking.eventImage}
                                        alt={booking.eventTitle}
                                        className="w-full sm:w-32 h-32 rounded-xl object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-bold text-surface-900 text-lg line-clamp-1">{booking.eventTitle}</h3>
                                            <span className={`flex-shrink-0 ${getStatusColor(booking.status)} capitalize`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-sm text-surface-500 mb-3">
                                            <p className="flex items-center gap-2">
                                                <HiCalendar className="w-4 h-4 text-primary-400" />
                                                {formatDateShort(booking.eventDate)}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <HiMapPin className="w-4 h-4 text-primary-400" />
                                                {booking.eventLocation}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <HiTicket className="w-4 h-4 text-primary-400" />
                                                {booking.ticketType} × {booking.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold gradient-text text-lg">{formatCurrency(booking.grandTotal)}</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" icon={HiEye} onClick={() => viewTicket(booking)}>
                                                    View Ticket
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={HiTicket}
                        title="No bookings found"
                        description={search ? 'No bookings match your search' : 'You haven\'t made any bookings yet'}
                        actionLabel="Browse Events"
                        onAction={() => window.location.href = '/events'}
                    />
                )}
            </div>

            {/* E-Ticket Modal */}
            <Modal
                isOpen={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                title="E-Ticket"
                size="md"
            >
                {selectedBooking && (
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 mb-6">
                            <p className="text-sm text-surface-500 mb-1">Booking ID</p>
                            <p className="font-mono font-bold text-lg text-primary-700 mb-4">{selectedBooking.id}</p>
                            <QRCode value={selectedBooking.qrCode} size={180} className="mx-auto mb-4" />
                            <p className="text-xs text-surface-400">Scan this QR code at the venue</p>
                        </div>

                        <div className="text-left space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Event</span>
                                <span className="font-medium text-surface-900">{selectedBooking.eventTitle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Date</span>
                                <span className="text-surface-700">{formatDateShort(selectedBooking.eventDate)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Ticket Type</span>
                                <span className="text-surface-700">{selectedBooking.ticketType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Quantity</span>
                                <span className="text-surface-700">{selectedBooking.quantity}</span>
                            </div>
                            <hr className="border-surface-100" />
                            <div className="flex justify-between">
                                <span className="font-semibold text-surface-900">Total Paid</span>
                                <span className="font-bold gradient-text">{formatCurrency(selectedBooking.grandTotal)}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-6" icon={HiArrowDownTray} variant="secondary">
                            Download E-Ticket
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BookingHistory;

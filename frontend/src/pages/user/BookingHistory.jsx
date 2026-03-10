import { useState, useEffect, useRef } from 'react';
import { getBookings } from '../../services/bookings';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';
import QRCode from '../../components/common/QRCode';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import html2canvas from 'html2canvas';
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
    const ticketRef = useRef(null);

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

    const handleDownloadTicket = () => {
        if (!selectedBooking || !ticketRef.current) return;

        // Convert SVG QR code to image, then draw ticket
        const svgEl = ticketRef.current.querySelector('svg');
        const drawTicket = (qrImage) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const w = 600, h = 820;
            canvas.width = w;
            canvas.height = h;

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);

            // Header gradient bar
            const headerGrad = ctx.createLinearGradient(0, 0, w, 0);
            headerGrad.addColorStop(0, '#6366f1');
            headerGrad.addColorStop(1, '#d946ef');
            ctx.fillStyle = headerGrad;
            ctx.fillRect(0, 0, w, 80);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('EventHub E-Ticket', w / 2, 50);

            // Booking ID
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px Inter, system-ui, sans-serif';
            ctx.fillText('Booking ID', w / 2, 115);
            ctx.fillStyle = '#4338ca';
            ctx.font = 'bold 18px Courier New, monospace';
            ctx.fillText(selectedBooking._id, w / 2, 140);

            // QR Code
            if (qrImage) {
                const qrSize = 180;
                ctx.drawImage(qrImage, (w - qrSize) / 2, 160, qrSize, qrSize);
            }

            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px Inter, system-ui, sans-serif';
            ctx.fillText('Scan this QR code at the venue', w / 2, 365);

            // Divider
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(40, 390);
            ctx.lineTo(w - 40, 390);
            ctx.stroke();

            // Details
            ctx.textAlign = 'left';
            const details = [
                ['Event', selectedBooking.eventTitle],
                ['Date', new Date(selectedBooking.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })],
                ['Location', selectedBooking.eventLocation || '-'],
                ['Ticket Type', selectedBooking.ticketType],
                ['Quantity', String(selectedBooking.quantity)],
            ];

            let y = 425;
            details.forEach(([label, value]) => {
                ctx.fillStyle = '#94a3b8';
                ctx.font = '14px Inter, system-ui, sans-serif';
                ctx.fillText(label, 50, y);
                ctx.fillStyle = '#0f172a';
                ctx.font = '14px Inter, system-ui, sans-serif';
                ctx.textAlign = 'right';
                const displayVal = value && value.length > 35 ? value.substring(0, 35) + '...' : value;
                ctx.fillText(displayVal || '-', w - 50, y);
                ctx.textAlign = 'left';
                y += 38;
            });

            // Total divider
            ctx.strokeStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(40, y - 10);
            ctx.lineTo(w - 40, y - 10);
            ctx.stroke();

            y += 15;
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 16px Inter, system-ui, sans-serif';
            ctx.fillText('Total Paid', 50, y);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#6366f1';
            ctx.font = 'bold 20px Inter, system-ui, sans-serif';
            ctx.fillText('\u20B9' + (selectedBooking.grandTotal?.toFixed(2) || '0.00'), w - 50, y);

            // Footer
            ctx.textAlign = 'center';
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.fillText('This is a computer-generated ticket. No signature required.', w / 2, h - 30);

            // Download
            const link = document.createElement('a');
            link.download = `e-ticket-${selectedBooking._id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        // Convert SVG to image
        if (svgEl) {
            const svgData = new XMLSerializer().serializeToString(svgEl);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            img.onload = () => {
                drawTicket(img);
                URL.revokeObjectURL(url);
            };
            img.onerror = () => {
                drawTicket(null);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } else {
            drawTicket(null);
        }
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
                                key={booking._id}
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
                    <div>
                        <div ref={ticketRef} style={{ padding: 24, backgroundColor: '#ffffff' }}>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>🎫 EventHub E-Ticket</h2>
                                <p style={{ fontSize: 12, color: '#94a3b8' }}>Present this ticket at the venue</p>
                            </div>
                            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 mb-6" style={{ textAlign: 'center' }}>
                                <p className="text-sm text-surface-500 mb-1">Booking ID</p>
                                <p className="font-mono font-bold text-lg text-primary-700 mb-4">{selectedBooking._id}</p>
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
                        </div>

                        <Button className="w-full mt-6" icon={HiArrowDownTray} variant="secondary" onClick={handleDownloadTicket}>
                            Download E-Ticket
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BookingHistory;


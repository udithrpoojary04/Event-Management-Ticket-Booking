import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import {
    HiCalendar,
    HiMapPin,
    HiClock,
    HiTicket,
    HiCreditCard,
    HiShieldCheck,
    HiMinus,
    HiPlus,
} from 'react-icons/hi2';

const BookingSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const { event, ticket, quantity: initialQty } = location.state || {};

    const [quantity, setQuantity] = useState(initialQty || 1);

    if (!event || !ticket) {
        navigate('/events');
        return null;
    }

    const subtotal = ticket.price * quantity;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    const handleProceedToPayment = () => {
        navigate('/payment', {
            state: {
                event,
                ticket,
                quantity,
                subtotal,
                serviceFee,
                total,
            },
        });
    };

    return (
        <div className="py-10 animate-fade-in">
            <div className="page-container max-w-4xl">
                <h1 className="text-3xl font-bold text-surface-900 mb-2">Booking Summary</h1>
                <p className="text-surface-500 mb-8">Review your booking details before proceeding</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event card */}
                        <div className="card overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <img src={event.image} alt={event.title} className="w-full sm:w-48 h-40 object-cover" />
                                <div className="p-6 flex-1">
                                    <span className="badge-primary text-xs mb-2">{event.category}</span>
                                    <h2 className="text-xl font-bold text-surface-900 mb-3">{event.title}</h2>
                                    <div className="space-y-2 text-sm text-surface-500">
                                        <p className="flex items-center gap-2">
                                            <HiCalendar className="w-4 h-4 text-primary-400" /> {formatDate(event.date)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <HiClock className="w-4 h-4 text-primary-400" /> {formatTime(event.time)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <HiMapPin className="w-4 h-4 text-primary-400" /> {event.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticket selection */}
                        <div className="card p-6">
                            <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                                <HiTicket className="w-5 h-5 text-primary-500" />
                                Ticket Details
                            </h3>
                            <div className="bg-surface-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-semibold text-surface-900">{ticket.type}</p>
                                        <p className="text-sm text-surface-500">{formatCurrency(ticket.price)} per ticket</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="p-1.5 rounded-lg border border-surface-200 hover:bg-white transition-all"
                                            aria-label="Decrease quantity"
                                        >
                                            <HiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => Math.min(10, q + 1))}
                                            className="p-1.5 rounded-lg border border-surface-200 hover:bg-white transition-all"
                                            aria-label="Increase quantity"
                                        >
                                            <HiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important info */}
                        <div className="card p-6 border-l-4 border-l-amber-400">
                            <h3 className="font-semibold text-surface-900 mb-2">Important Information</h3>
                            <ul className="text-sm text-surface-500 space-y-1 list-disc pl-4">
                                <li>Tickets are non-transferable</li>
                                <li>Free cancellation up to 48 hours before the event</li>
                                <li>Please bring a valid ID to the event</li>
                                <li>E-ticket will be sent to your registered email</li>
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-bold text-surface-900 mb-6">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-surface-500">{ticket.type} × {quantity}</span>
                                    <span className="text-surface-700">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Service fee (5%)</span>
                                    <span className="text-surface-700">{formatCurrency(serviceFee)}</span>
                                </div>
                                <hr className="border-surface-100" />
                                <div className="flex justify-between text-base">
                                    <span className="font-bold text-surface-900">Total</span>
                                    <span className="font-bold gradient-text text-xl">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleProceedToPayment}
                                className="w-full mt-6"
                                size="lg"
                                icon={HiCreditCard}
                            >
                                Proceed to Payment
                            </Button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-surface-400">
                                <HiShieldCheck className="w-4 h-4 text-emerald-500" />
                                Secure checkout powered by EventHub
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;

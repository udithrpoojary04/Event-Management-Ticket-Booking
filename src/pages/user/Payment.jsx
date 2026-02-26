import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/bookings';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
    HiCreditCard,
    HiLockClosed,
    HiCheckCircle,
    HiXCircle,
    HiTicket,
    HiArrowRight,
    HiHome,
} from 'react-icons/hi2';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const { event, ticket, quantity, subtotal, serviceFee, total } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null); // null, 'processing', 'success', 'failed'
    const [bookingData, setBookingData] = useState(null);
    const [cardForm, setCardForm] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });

    if (!event || !ticket) {
        navigate('/events');
        return null;
    }

    const handleCardChange = (e) => {
        let { name, value } = e.target;
        if (name === 'number') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        }
        if (name === 'expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
        setCardForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setStatus('processing');
        setProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(r => setTimeout(r, 2500));

            const booking = await createBooking({
                eventId: event.id,
                eventTitle: event.title,
                eventImage: event.image,
                eventDate: event.date,
                eventLocation: event.location,
                ticketType: ticket.type,
                quantity,
                unitPrice: ticket.price,
                totalPrice: subtotal,
                serviceFee,
                grandTotal: total,
                paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
            });

            setBookingData(booking.data);
            setStatus('success');
            toast.success('Payment successful!');
        } catch (err) {
            setStatus('failed');
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    // Status screens
    if (status === 'processing') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <h2 className="text-2xl font-bold text-surface-900 mb-2">Processing Payment</h2>
                    <p className="text-surface-500">Please wait while we process your payment...</p>
                    <p className="text-sm text-surface-400 mt-2">Do not close this window</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center py-10">
                <div className="text-center max-w-md animate-bounce-in">
                    <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <HiCheckCircle className="w-16 h-16 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-surface-900 mb-2">Payment Successful!</h2>
                    <p className="text-surface-500 mb-6">Your booking has been confirmed. Check your email for the e-ticket.</p>

                    <div className="card p-6 text-left mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-surface-500">Booking ID</span>
                            <span className="font-mono font-semibold text-primary-600">{bookingData?.id}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-surface-500">Event</span>
                            <span className="font-medium text-surface-900">{event.title}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-surface-500">Ticket</span>
                            <span className="text-surface-700">{ticket.type} × {quantity}</span>
                        </div>
                        <hr className="my-3 border-surface-100" />
                        <div className="flex justify-between">
                            <span className="font-semibold text-surface-900">Amount Paid</span>
                            <span className="font-bold gradient-text">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => navigate('/bookings')}
                            icon={HiTicket}
                            className="flex-1"
                        >
                            View Bookings
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            icon={HiHome}
                            className="flex-1"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center max-w-md animate-fade-in">
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <HiXCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-surface-900 mb-2">Payment Failed</h2>
                    <p className="text-surface-500 mb-6">Something went wrong with your payment. No charges have been made.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => setStatus(null)}>
                            Try Again
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/events')}>
                            Browse Events
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Payment form
    return (
        <div className="py-10 animate-fade-in">
            <div className="page-container max-w-4xl">
                <h1 className="text-3xl font-bold text-surface-900 mb-2">Payment</h1>
                <p className="text-surface-500 mb-8">Complete your purchase securely</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Payment method selection */}
                        <div className="card p-6 mb-6">
                            <h3 className="font-bold text-surface-900 mb-4">Payment Method</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'card', label: 'Credit Card', icon: '💳' },
                                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === method.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-surface-200 hover:border-surface-300'
                                            }`}
                                    >
                                        <span className="text-2xl mb-2 block">{method.icon}</span>
                                        <span className="font-semibold text-sm text-surface-900">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card form */}
                        {paymentMethod === 'card' && (
                            <form onSubmit={handlePayment} className="card p-6">
                                <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                                    <HiCreditCard className="w-5 h-5 text-primary-500" />
                                    Card Details
                                </h3>
                                <div className="space-y-4">
                                    <Input
                                        label="Card Number"
                                        name="number"
                                        value={cardForm.number}
                                        onChange={handleCardChange}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        icon={HiCreditCard}
                                    />
                                    <Input
                                        label="Cardholder Name"
                                        name="name"
                                        value={cardForm.name}
                                        onChange={handleCardChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Expiry Date"
                                            name="expiry"
                                            value={cardForm.expiry}
                                            onChange={handleCardChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                        <Input
                                            label="CVV"
                                            type="password"
                                            name="cvv"
                                            value={cardForm.cvv}
                                            onChange={handleCardChange}
                                            placeholder="•••"
                                            required
                                            icon={HiLockClosed}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-6" size="lg" loading={processing} icon={HiLockClosed}>
                                    Pay {formatCurrency(total)}
                                </Button>
                            </form>
                        )}

                        {paymentMethod === 'paypal' && (
                            <form onSubmit={handlePayment} className="card p-6">
                                <div className="text-center py-8">
                                    <p className="text-5xl mb-4">🅿️</p>
                                    <h3 className="font-bold text-surface-900 mb-2">Pay with PayPal</h3>
                                    <p className="text-sm text-surface-500 mb-6">You will be redirected to PayPal to complete payment</p>
                                    <Button type="submit" size="lg" loading={processing} className="mx-auto">
                                        Continue to PayPal <HiArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order summary sidebar */}
                    <div>
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-bold text-surface-900 mb-4">Order Summary</h3>
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-surface-100">
                                <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
                                <div>
                                    <p className="font-semibold text-sm text-surface-900 line-clamp-1">{event.title}</p>
                                    <p className="text-xs text-surface-500">{ticket.type} × {quantity}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Service fee</span>
                                    <span>{formatCurrency(serviceFee)}</span>
                                </div>
                                <hr className="border-surface-100" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="gradient-text text-lg">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;

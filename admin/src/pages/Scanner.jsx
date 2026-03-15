import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiSearch, FiXCircle } from 'react-icons/fi';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../services/api';

export default function Scanner() {
    const [qrInput, setQrInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [error, setError] = useState('');
    const [cameraError, setCameraError] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const [booking, setBooking] = useState(null);
    const scannerRef = useRef(null);
    const lastScannedRef = useRef('');

    const isAlreadyCheckedIn = useMemo(() => !!booking?.checkedInAt, [booking]);
    const isCancelled = booking?.status === 'cancelled';

    const lookupByQr = async (value) => {
        if (!value) return;

        setLoading(true);
        setError('');
        setBooking(null);

        try {
            const res = await api.get(`/admin/scan/${encodeURIComponent(value)}`);
            setBooking(res.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to scan ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (e) => {
        e.preventDefault();
        await lookupByQr(qrInput.trim());
    };

    const stopCamera = async () => {
        const scanner = scannerRef.current;
        if (!scanner) return;

        try {
            await scanner.stop();
        } catch {
            // ignore
        }

        try {
            await scanner.clear();
        } catch {
            // ignore
        }

        scannerRef.current = null;
        setCameraActive(false);
    };

    const startCamera = async () => {
        if (scannerRef.current) return;

        setCameraError('');
        setError('');
        lastScannedRef.current = '';

        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.333334 },
                async (decodedText) => {
                    const value = decodedText?.trim();
                    if (!value) return;
                    if (value === lastScannedRef.current) return;

                    lastScannedRef.current = value;
                    setQrInput(value);
                    await stopCamera();
                    await lookupByQr(value);
                },
                () => {
                    // ignore decode misses
                }
            );
            setCameraActive(true);
        } catch (err) {
            setCameraError(err?.message || 'Unable to access mobile camera for scanning');
            await stopCamera();
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handleCheckIn = async () => {
        if (!booking?._id) return;
        setCheckingIn(true);
        setError('');
        try {
            const res = await api.put(`/admin/bookings/${booking._id}/check-in`);
            setBooking(res.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Check-in failed');
        } finally {
            setCheckingIn(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>QR Scanner</h1>
                    <p>Scan a ticket QR code to view ticket details and check in attendee</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <form onSubmit={handleScan} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
                        <FiSearch size={16} />
                        <input
                            placeholder="Scan or paste QR value (e.g., EVHUB-...)"
                            value={qrInput}
                            onChange={(e) => setQrInput(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Scanning...' : 'Scan Ticket'}
                    </button>
                    <button
                        className="btn-primary"
                        type="button"
                        onClick={cameraActive ? stopCamera : startCamera}
                        style={{ background: cameraActive ? 'var(--danger)' : undefined }}
                    >
                        {cameraActive ? 'Stop Camera' : 'Scan with Mobile Camera'}
                    </button>
                </form>
                <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                    Tip: Most handheld QR scanners type into this field and press Enter automatically.
                </p>

                {cameraError && (
                    <p style={{ marginTop: 8, fontSize: 12, color: 'var(--danger)' }}>
                        {cameraError}
                    </p>
                )}

                <div
                    id="qr-reader"
                    style={{
                        marginTop: 12,
                        width: '100%',
                        maxWidth: 420,
                        display: cameraActive ? 'block' : 'none',
                        borderRadius: 12,
                        overflow: 'hidden',
                    }}
                />
            </div>

            {error && (
                <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.35)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)' }}>
                        <FiXCircle />
                        <strong>Scan Error</strong>
                    </div>
                    <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{error}</p>
                </div>
            )}

            {booking && (
                <div className="card">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 18,
                        gap: 12,
                        flexWrap: 'wrap',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Ticket Details</h3>
                        <span className={`badge ${isAlreadyCheckedIn ? 'completed' : booking.status}`}>
                            {isAlreadyCheckedIn ? 'checked-in' : booking.status}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                        <Info label="Booking ID" value={booking.bookingId ?? booking._id} mono />
                        <Info label="QR Code" value={booking.qrCode} mono />
                        <Info label="Event" value={booking.eventTitle || booking.event?.title || '—'} />
                        <Info label="Date" value={booking.eventDate || booking.event?.date || '—'} />
                        <Info label="Time" value={booking.event?.time || '—'} />
                        <Info label="Location" value={booking.eventLocation || booking.event?.location || '—'} />
                        <Info label="Attendee" value={booking.user?.name || '—'} />
                        <Info label="Email" value={booking.user?.email || '—'} />
                        <Info label="Ticket" value={`${booking.ticketType} × ${booking.quantity}`} />
                        <Info label="Amount" value={`₹${booking.grandTotal?.toFixed(2) || '0.00'}`} />
                        <Info label="Booked On" value={new Date(booking.createdAt).toLocaleString()} />
                        <Info
                            label="Checked In"
                            value={booking.checkedInAt ? new Date(booking.checkedInAt).toLocaleString() : 'Not checked-in'}
                        />
                    </div>

                    <div style={{ marginTop: 22, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            onClick={handleCheckIn}
                            disabled={checkingIn || isAlreadyCheckedIn || isCancelled}
                        >
                            {checkingIn ? 'Checking in...' : isAlreadyCheckedIn ? 'Already Checked In' : 'Check In Ticket'}
                        </button>

                        {isAlreadyCheckedIn && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 600 }}>
                                <FiCheckCircle /> Entry verified
                            </span>
                        )}

                        {isCancelled && (
                            <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Cancelled booking cannot be checked in.</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Info({ label, value, mono = false }) {
    return (
        <div style={{
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            padding: '10px 12px',
            background: 'var(--bg-secondary)',
        }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {label}
            </div>
            <div style={{
                fontSize: 14,
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
                wordBreak: 'break-word',
            }}>
                {value}
            </div>
        </div>
    );
}

import { createContext, useContext, useState, useCallback } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiExclamationTriangle, HiInformationCircle, HiXMark } from 'react-icons/hi2';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const TOAST_ICONS = {
    success: HiCheckCircle,
    error: HiExclamationCircle,
    warning: HiExclamationTriangle,
    info: HiInformationCircle,
};

const TOAST_STYLES = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_STYLES = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error: (msg, dur) => addToast(msg, 'error', dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
        info: (msg, dur) => addToast(msg, 'info', dur),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div
                className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
                aria-live="polite"
                aria-label="Notifications"
            >
                {toasts.map((t) => {
                    const Icon = TOAST_ICONS[t.type];
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in-right ${TOAST_STYLES[t.type]}`}
                            role="alert"
                        >
                            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ICON_STYLES[t.type]}`} />
                            <p className="text-sm font-medium flex-1">{t.message}</p>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                                aria-label="Dismiss notification"
                            >
                                <HiXMark className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    className = '',
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]',
    };

    const handleEsc = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className={`
        relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]}
        animate-scale-in max-h-[85vh] flex flex-col ${className}
      `}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                        {title && (
                            <h2 id="modal-title" className="text-xl font-bold text-surface-900">{title}</h2>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all"
                                aria-label="Close modal"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;

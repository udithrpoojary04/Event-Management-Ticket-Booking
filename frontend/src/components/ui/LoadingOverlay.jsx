const LoadingOverlay = ({ message = 'Loading...' }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
            role="status"
            aria-label="Loading"
        >
            <div className="text-center animate-fade-in">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
                </div>
                <p className="text-surface-600 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;

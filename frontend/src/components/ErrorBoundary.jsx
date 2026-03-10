import { Component } from 'react';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-8">
                    <div className="text-center max-w-md animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <HiExclamationTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-3">
                            Something went wrong
                        </h2>
                        <p className="text-surface-500 mb-6">
                            An unexpected error occurred. Please try again or contact support if the issue persists.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="btn-primary inline-flex items-center gap-2"
                            aria-label="Try again"
                        >
                            <HiArrowPath className="w-5 h-5" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

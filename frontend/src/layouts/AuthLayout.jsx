import { Outlet, Link } from 'react-router-dom';
import { HiCalendarDays } from 'react-icons/hi2';

const AuthLayout = () => {
    return (
        <div className="min-h-screen gradient-bg-subtle flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                        <HiCalendarDays className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">Eventify</span>
                </Link>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 animate-fade-in-up">
                    <Outlet />
                </div>

                {/* Bottom text */}
                <p className="text-center text-sm text-surface-400 mt-6">
                    © {new Date().getFullYear()} Eventify. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;

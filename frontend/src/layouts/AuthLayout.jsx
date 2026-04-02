import { Outlet, Link } from 'react-router-dom';
import { HiCalendarDays } from 'react-icons/hi2';
import authBg from '../assets/auth-bg.png';

const AuthLayout = () => {
    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url(${authBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="relative w-full max-w-md z-10">
               
                <Link to="/" className="flex flex-col items-center justify-center gap-4 mb-8 group transition-transform duration-500 hover:scale-105">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:shadow-primary-500/20 group-hover:border-white/40 transition-all">
                        <HiCalendarDays className="w-9 h-9 text-white group-hover:text-primary-200 transition-colors" />
                    </div>
                    <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                        Event<span className="text-primary-400">ify</span>
                    </span>
                </Link>

                {/* Card with enhanced Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20 p-10 animate-fade-in-up">
                    <div className="text-white">
                        <Outlet />
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center text-sm text-white/60 mt-8 drop-shadow-sm font-medium">
                    © {new Date().getFullYear()} Eventify. High standards for your events.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;

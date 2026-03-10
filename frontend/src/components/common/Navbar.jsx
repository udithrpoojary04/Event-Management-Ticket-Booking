import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HiOutlineBars3,
    HiXMark,
    HiMagnifyingGlass,
    HiUserCircle,
    HiArrowRightOnRectangle,
    HiCog6Tooth,
    HiTicket,
    HiSquares2X2,
    HiCalendarDays,
    HiChevronDown,
} from 'react-icons/hi2';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    const navLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
            ? 'text-primary-600 bg-primary-50'
            : 'text-surface-600 hover:text-primary-600 hover:bg-surface-50'
        }`;

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface-100">
            <nav className="page-container" aria-label="Main navigation">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group" aria-label="EventHub Home">
                        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:shadow-lg transition-shadow">
                            <HiCalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">EventHub</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                        <NavLink to="/events" className={navLinkClass}>Events</NavLink>
                        {isAuthenticated && (
                            <NavLink to="/bookings" className={navLinkClass}>My Bookings</NavLink>
                        )}
                        {isAdmin && (
                            <NavLink to="/admin" className={navLinkClass}>
                                <span className="flex items-center gap-1">
                                    <HiSquares2X2 className="w-4 h-4" />
                                    Admin
                                </span>
                            </NavLink>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Search shortcut */}
                        <button
                            onClick={() => navigate('/events')}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-surface-400 bg-surface-50 rounded-xl border border-surface-200 hover:border-primary-300 hover:text-primary-500 transition-all"
                            aria-label="Search events"
                        >
                            <HiMagnifyingGlass className="w-4 h-4" />
                            <span>Search events...</span>
                        </button>

                        {isAuthenticated ? (
                            /* Profile dropdown */
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-50 transition-all"
                                    aria-expanded={profileOpen}
                                    aria-haspopup="true"
                                    aria-label="User menu"
                                >
                                    <img
                                        src={user?.avatar || 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff'}
                                        alt=""
                                        className="w-8 h-8 rounded-full ring-2 ring-primary-200"
                                    />
                                    <span className="hidden md:block text-sm font-medium text-surface-700">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                    <HiChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-100 py-2 z-20 animate-fade-in-down">
                                            <div className="px-4 py-3 border-b border-surface-100">
                                                <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                                                <p className="text-xs text-surface-500">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                                            >
                                                <HiUserCircle className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link
                                                to="/bookings"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                                            >
                                                <HiTicket className="w-4 h-4" /> My Bookings
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                                                >
                                                    <HiCog6Tooth className="w-4 h-4" /> Admin Panel
                                                </Link>
                                            )}
                                            <hr className="my-1 border-surface-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <HiArrowRightOnRectangle className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-surface-600 hover:text-primary-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm !px-4 !py-2"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-surface-100 py-4 animate-fade-in-down">
                        <div className="flex flex-col gap-1">
                            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>Home</NavLink>
                            <NavLink to="/events" className={navLinkClass} onClick={() => setMobileOpen(false)}>Events</NavLink>
                            {isAuthenticated && (
                                <>
                                    <NavLink to="/bookings" className={navLinkClass} onClick={() => setMobileOpen(false)}>My Bookings</NavLink>
                                    <NavLink to="/profile" className={navLinkClass} onClick={() => setMobileOpen(false)}>Profile</NavLink>
                                </>
                            )}
                            {isAdmin && (
                                <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>Admin Panel</NavLink>
                            )}
                            {!isAuthenticated && (
                                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-surface-100">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full text-center px-4 py-2.5 text-sm font-semibold text-surface-600 border-2 border-surface-200 rounded-xl hover:bg-surface-50"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full text-center btn-primary text-sm"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

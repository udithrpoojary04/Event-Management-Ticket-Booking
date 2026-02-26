import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiSquares2X2,
    HiCalendarDays,
    HiUsers,
    HiCurrencyDollar,
    HiArrowLeftOnRectangle,
    HiChartBar,
    HiPlus,
} from 'react-icons/hi2';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sidebarLinks = [
        { to: '/admin', icon: HiSquares2X2, label: 'Dashboard', end: true },
        { to: '/admin/events', icon: HiCalendarDays, label: 'Events' },
        { to: '/admin/events/new', icon: HiPlus, label: 'Create Event' },
        { to: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
        { to: '/admin/users', icon: HiUsers, label: 'Users' },
        { to: '/admin/revenue', icon: HiCurrencyDollar, label: 'Revenue' },
    ];

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
            ? 'bg-primary-50 text-primary-700 shadow-sm'
            : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
        }`;

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-100 p-4" aria-label="Admin sidebar">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 px-4 py-3 mb-6">
                    <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                        <HiCalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">EventHub</span>
                </Link>

                {/* Nav links */}
                <nav className="flex-1 space-y-1">
                    {sidebarLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={navClass} end={link.end}>
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-surface-100 pt-4 mt-4">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'}
                            alt=""
                            className="w-9 h-9 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                            <p className="text-xs text-surface-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <HiArrowLeftOnRectangle className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar for mobile */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                            <HiCalendarDays className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold gradient-text">Admin</span>
                    </Link>
                    <Link to="/" className="text-sm text-surface-500 hover:text-primary-600">← Back to Site</Link>
                </header>

                {/* Mobile nav */}
                <nav className="lg:hidden flex overflow-x-auto gap-1 px-4 py-2 bg-white border-b border-surface-100" aria-label="Admin mobile navigation">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-500 hover:bg-surface-50'
                                }`
                            }
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <main className="flex-1 p-4 lg:p-8" id="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

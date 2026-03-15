import { NavLink } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiBookOpen, FiMessageSquare, FiLogOut, FiStar, FiCamera } from 'react-icons/fi';

const navItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/events', icon: FiCalendar, label: 'Events' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/bookings', icon: FiBookOpen, label: 'Bookings' },
    { path: '/scanner', icon: FiCamera, label: 'Scanner' },
    { path: '/reviews', icon: FiStar, label: 'Reviews' },
    // { path: '/feedback', icon: FiMessageSquare, label: 'Feedback' },
];

export default function Sidebar({ onLogout }) {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <span style={styles.logoIcon}>⚡</span>
                <span style={styles.logoText}>Eventify</span>
                <span style={styles.adminBadge}>Admin</span>
            </div>

            <nav style={styles.nav}>
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        style={({ isActive }) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.navItemActive : {}),
                        })}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={styles.footer}>
                <button onClick={onLogout} style={styles.logoutBtn}>
                    <FiLogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '24px 20px',
        borderBottom: '1px solid var(--border-color)',
    },
    logoIcon: {
        fontSize: '24px',
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    adminBadge: {
        fontSize: '10px',
        fontWeight: 600,
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        padding: '2px 8px',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    nav: {
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    navItemActive: {
        background: 'rgba(99, 102, 241, 0.12)',
        color: 'var(--accent)',
    },
    footer: {
        padding: '16px 12px',
        borderTop: '1px solid var(--border-color)',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--danger)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        fontFamily: 'var(--font-family)',
        transition: 'all 0.2s ease',
    },
};

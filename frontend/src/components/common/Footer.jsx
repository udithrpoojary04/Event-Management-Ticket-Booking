import { Link } from 'react-router-dom';
import { HiCalendarDays, HiHeart } from 'react-icons/hi2';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Platform: [
            { label: 'Browse Events', to: '/events' },
            { label: 'Create Event', to: '/admin/events/new' },
            { label: 'Pricing', to: '#' },
            { label: 'Features', to: '#' },
        ],
        Company: [
            { label: 'About Us', to: '#' },
            { label: 'Careers', to: '#' },
            { label: 'Blog', to: '#' },
            { label: 'Contact', to: '#' },
        ],
        Support: [
            { label: 'Help Center', to: '#' },
            { label: 'Terms of Service', to: '#' },
            { label: 'Privacy Policy', to: '#' },
            { label: 'Refund Policy', to: '#' },
        ],
    };

    return (
        <footer className="bg-surface-900 text-surface-300">
            <div className="page-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                <HiCalendarDays className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Eventify</span>
                        </Link>
                        <p className="text-surface-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Discover and book amazing events near you. From music festivals to tech conferences,
                            we bring people together through unforgettable experiences.
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {['twitter', 'github', 'linkedin', 'instagram'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center text-surface-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                                    aria-label={`Follow us on ${social}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-surface-800">
                <div className="page-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-surface-500">
                        © {currentYear} Eventify. All rights reserved.
                    </p>
                    {/* <p className="text-sm text-surface-500 flex items-center gap-1">
                        Made with <HiHeart className="w-4 h-4 text-red-500" /> for event lovers
                    </p> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;

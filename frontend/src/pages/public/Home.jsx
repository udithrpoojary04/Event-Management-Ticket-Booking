import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFeaturedEvents, getEvents, categories } from '../../services/events';
import EventCard from '../../components/cards/EventCard';
import Button from '../../components/ui/Button';
import {
    HiArrowRight,
    HiSparkles,
    HiUserGroup,
    HiGlobeAlt,
    HiShieldCheck,
    HiChevronLeft,
    HiChevronRight,
    HiCalendarDays,
    HiMagnifyingGlass,
} from 'react-icons/hi2';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, allRes] = await Promise.all([
                    getFeaturedEvents(),
                    getEvents(),
                ]);
                setFeaturedEvents(featuredRes.data);
                setAllEvents(allRes.data);
            } catch (err) {
                console.error('Error loading events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        if (featuredEvents.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % featuredEvents.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredEvents.length]);

    const handleCategoryFilter = async (category) => {
        setActiveCategory(category);
        setLoading(true);
        try {
            const res = await getEvents(category !== 'All' ? { category } : {});
            setAllEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: HiCalendarDays, value: '500+', label: 'Events' },
        { icon: HiUserGroup, value: '50K+', label: 'Attendees' },
        { icon: HiGlobeAlt, value: '30+', label: 'Cities' },
        { icon: HiShieldCheck, value: '99.9%', label: 'Uptime' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-surface-950 text-white">
                <div className="absolute inset-0" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-surface-950/80 to-accent-900/70" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative page-container py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 animate-fade-in-down">
                                <HiSparkles className="w-4 h-4 text-amber-400" />
                                <span>Discover 500+ Events Worldwide</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
                                Find Your Next
                                <span className="block bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300 bg-clip-text text-transparent">
                                    Unforgettable Experience
                                </span>
                            </h1>
                            <p className="text-lg text-surface-300 mb-8 max-w-xl animate-fade-in-up animate-delay-100">
                                Book tickets to the best concerts, conferences, workshops, and festivals.
                                Join thousands of event enthusiasts today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200">
                                <Link to="/events" className="btn-primary text-base !px-8 !py-4 inline-flex items-center gap-2">
                                    <HiMagnifyingGlass className="w-5 h-5" />
                                    Explore Events
                                </Link>
                                <Link to={isAuthenticated ? '/events' : '/register'} className="btn-secondary !bg-white/10 !border-white/20 !text-white hover:!bg-white/20 text-base !px-8 !py-4 inline-flex items-center gap-2">
                                    Get Started Free
                                    <HiArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Right: Floating Event Cards Illustration */}
                        {/* Right: Upcoming Events Preview */}
                        <div className="hidden lg:flex flex-col gap-4 animate-fade-in-up animate-delay-200">
                            <p className="text-sm text-surface-400 font-medium uppercase tracking-wider mb-1">Upcoming Events</p>
                            {allEvents.slice(0, 3).map((event) => {
                                const lowestPrice = event.tickets?.length > 0
                                    ? Math.min(...event.tickets.map(t => t.price))
                                    : null;
                                return (
                                    <Link
                                        key={event._id}
                                        to={`/events/${event._id}`}
                                        className="flex gap-4 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 group"
                                    >
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="flex flex-col justify-center min-w-0">
                                            <h3 className="font-semibold text-white text-sm truncate">{event.title}</h3>
                                            <p className="text-xs text-surface-400 mt-1 flex items-center gap-1">
                                                <HiCalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-surface-400 mt-0.5 truncate flex items-center gap-1">
                                                <HiGlobeAlt className="w-3.5 h-3.5 flex-shrink-0" />
                                                {event.location}
                                            </p>
                                            {lowestPrice !== null && (
                                                <p className="text-xs font-semibold text-primary-300 mt-1">
                                                    From ₹{lowestPrice}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                            {allEvents.length > 3 && (
                                <Link to="/events" className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 mt-1 transition-colors">
                                    View all events <HiArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative -mt-8 z-10">
                <div className="page-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="glass-card p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                                <p className="text-sm text-surface-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events Carousel */}
            {featuredEvents.length > 0 && (
                <section className="py-20">
                    <div className="page-container">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <h2 className="section-heading">Featured Events</h2>
                                <p className="section-subheading">Don't miss out on these trending experiences</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentSlide(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length)}
                                    className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-all"
                                    aria-label="Previous slide"
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentSlide(prev => (prev + 1) % featuredEvents.length)}
                                    className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-all"
                                    aria-label="Next slide"
                                >
                                    <HiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl" ref={carouselRef}>
                            <div
                                className="flex transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {featuredEvents.map((event) => (
                                    <div key={event._id} className="w-full flex-shrink-0">
                                        <Link to={`/events/${event._id}`} className="block group">
                                            <div className="relative h-64 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                                                    <span className="badge bg-white/20 backdrop-blur-sm text-white text-xs mb-3">
                                                        {event.category}
                                                    </span>
                                                    <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2">{event.title}</h3>
                                                    <p className="text-surface-200 text-sm sm:text-base max-w-2xl line-clamp-2">{event.description}</p>
                                                    <div className="flex items-center gap-4 mt-4 text-sm text-surface-300">
                                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span>•</span>
                                                        <span>{event.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-6">
                                {featuredEvents.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 gradient-bg' : 'w-2 bg-surface-300'
                                            }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Browse by Category */}
            <section className="py-20 bg-white">
                <div className="page-container">
                    <div className="text-center mb-10">
                        <h2 className="section-heading">Browse Events</h2>
                        <p className="section-subheading">Choose your interest and find the perfect event</p>
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryFilter(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                                    ? 'gradient-bg text-white shadow-glow'
                                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Events Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="card overflow-hidden">
                                    <div className="h-48 shimmer-bg" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 shimmer-bg rounded w-3/4" />
                                        <div className="h-4 shimmer-bg rounded w-1/2" />
                                        <div className="h-4 shimmer-bg rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allEvents.map((event, i) => (
                                <div key={event._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/events" className="btn-secondary inline-flex items-center gap-2">
                            View All Events
                            <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;

import { useState, useEffect } from 'react';
import { getEvents, categories, cities } from '../../services/events';
import EventCard from '../../components/cards/EventCard';
import Input from '../../components/ui/Input';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import {
    HiMagnifyingGlass,
    HiFunnel,
    HiXMark,
    HiSquares2X2,
    HiListBullet,
    HiCalendarDays,
} from 'react-icons/hi2';

const EventSearch = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 8;

    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        city: 'All Cities',
        minPrice: '',
        maxPrice: '',
        dateFrom: '',
        dateTo: '',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (customFilters = filters) => {
        setLoading(true);
        try {
            const res = await getEvents(customFilters);
            setEvents(res.data);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            category: 'All',
            city: 'All Cities',
            minPrice: '',
            maxPrice: '',
            dateFrom: '',
            dateTo: '',
        };
        setFilters(defaultFilters);
        fetchEvents(defaultFilters);
    };

    const hasActiveFilters = filters.category !== 'All' || filters.city !== 'All Cities' || filters.minPrice || filters.maxPrice;

    // Pagination
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const paginatedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

    return (
        <div className="py-8 animate-fade-in">
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-surface-900 mb-2">Discover Events</h1>
                    <p className="text-surface-500">Find events that match your interests</p>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search events, venues, categories..."
                            className="input-field !pl-12 !pr-32 !py-4 !rounded-2xl text-base"
                            aria-label="Search events"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !px-6 !py-2.5 !rounded-xl text-sm"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-surface-900 flex items-center gap-2">
                                    <HiFunnel className="w-5 h-5 text-primary-500" />
                                    Filters
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-surface-700 mb-3">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                handleFilterChange('category', cat);
                                                fetchEvents({ ...filters, category: cat });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.category === cat
                                                    ? 'gradient-bg text-white'
                                                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* City */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-surface-700 mb-3">City</label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => {
                                        handleFilterChange('city', e.target.value);
                                        fetchEvents({ ...filters, city: e.target.value });
                                    }}
                                    className="input-field !py-2.5 text-sm"
                                    aria-label="Select city"
                                >
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-surface-700 mb-3">Price Range</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        placeholder="Min"
                                        className="input-field !py-2 text-sm"
                                        min="0"
                                        aria-label="Minimum price"
                                    />
                                    <span className="text-surface-400">—</span>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        placeholder="Max"
                                        className="input-field !py-2 text-sm"
                                        min="0"
                                        aria-label="Maximum price"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-3">Date Range</label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                        className="input-field !py-2 text-sm"
                                        aria-label="From date"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                        className="input-field !py-2 text-sm"
                                        aria-label="To date"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => fetchEvents()}
                                className="btn-primary w-full mt-6 text-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-surface-500">
                                <span className="font-semibold text-surface-900">{events.length}</span> events found
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm bg-surface-100 rounded-xl hover:bg-surface-200 transition-all"
                                >
                                    <HiFunnel className="w-4 h-4" />
                                    Filters
                                </button>
                                <div className="hidden sm:flex items-center bg-surface-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
                                        aria-label="Grid view"
                                    >
                                        <HiSquares2X2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
                                        aria-label="List view"
                                    >
                                        <HiListBullet className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Events */}
                        {loading ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="card overflow-hidden">
                                        <div className="h-48 shimmer-bg" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-5 shimmer-bg rounded w-3/4" />
                                            <div className="h-4 shimmer-bg rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : paginatedEvents.length > 0 ? (
                            <>
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                    {paginatedEvents.map((event, i) => (
                                        <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    className="mt-10"
                                />
                            </>
                        ) : (
                            <EmptyState
                                icon={HiCalendarDays}
                                title="No events found"
                                description="Try adjusting your filters or search terms"
                                actionLabel="Clear Filters"
                                onAction={clearFilters}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventSearch;

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, i) =>
                page === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-surface-400">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                ? 'gradient-bg text-white shadow-glow'
                                : 'text-surface-600 hover:bg-surface-100'
                            }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
};

export default Pagination;

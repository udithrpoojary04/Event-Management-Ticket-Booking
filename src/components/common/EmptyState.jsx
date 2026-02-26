import Button from '../ui/Button';

const EmptyState = ({
    icon: Icon,
    title = 'Nothing here yet',
    description = 'There are no items to display at the moment.',
    actionLabel,
    onAction,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in ${className}`}>
            {Icon ? (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-primary-500" />
                </div>
            ) : (
                <div className="mb-6" aria-hidden="true">
                    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="text-surface-200">
                        <rect x="10" y="20" width="100" height="60" rx="8" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                        <circle cx="60" cy="45" r="12" stroke="currentColor" strokeWidth="2" />
                        <path d="M55 45l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35 65h50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M40 72h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    </svg>
                </div>
            )}
            <h3 className="text-xl font-bold text-surface-900 mb-2">{title}</h3>
            <p className="text-surface-500 max-w-sm mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;

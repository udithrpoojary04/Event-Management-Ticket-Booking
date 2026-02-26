const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    type = 'button',
    ...props
}) => {
    const variants = {
        primary: 'gradient-bg text-white hover:shadow-glow hover:opacity-90',
        secondary: 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50',
        outline: 'bg-transparent text-surface-700 border-2 border-surface-200 hover:border-surface-400 hover:bg-surface-50',
        danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg',
        ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
        md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
        lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-300 ease-out active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" aria-hidden="true" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" aria-hidden="true" />}
                </>
            )}
        </button>
    );
};

export default Button;

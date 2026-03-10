const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', className = '' }) => {
    const colors = {
        primary: 'from-primary-500 to-primary-700',
        accent: 'from-accent-500 to-accent-700',
        emerald: 'from-emerald-500 to-emerald-700',
        amber: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-700',
        blue: 'from-blue-500 to-blue-700',
    };

    const iconBg = {
        primary: 'bg-primary-400/30',
        accent: 'bg-accent-400/30',
        emerald: 'bg-emerald-400/30',
        amber: 'bg-amber-400/30',
        red: 'bg-red-400/30',
        blue: 'bg-blue-400/30',
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} p-6 text-white shadow-lg hover-lift ${className}`}>
            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" aria-hidden="true" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" aria-hidden="true" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm text-white/70 font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-emerald-300' : 'text-red-300'}`}>
                            <span>{trend === 'up' ? '↑' : '↓'}</span>
                            <span>{trendValue}</span>
                            <span className="text-white/50">vs last month</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${iconBg[color]}`} aria-hidden="true">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;

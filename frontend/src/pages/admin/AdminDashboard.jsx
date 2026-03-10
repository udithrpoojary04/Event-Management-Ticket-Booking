import { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/bookings';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';
import DashboardCard from '../../components/cards/DashboardCard';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import {
    HiCalendarDays,
    HiTicket,
    HiCurrencyRupee,
    HiUsers,
    HiArrowTrendingUp,
} from 'react-icons/hi2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminStats();
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 shimmer-bg rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 shimmer-bg rounded-2xl" />
                    <div className="h-80 shimmer-bg rounded-2xl" />
                </div>
            </div>
        );
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const revenueChartData = {
        labels: months,
        datasets: [{
            label: 'Revenue',
            data: stats.revenueByMonth,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointBorderWidth: 0,
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    };

    const ticketsChartData = {
        labels: stats.ticketsByEvent.map(t => t.event),
        datasets: [{
            label: 'Tickets Sold',
            data: stats.ticketsByEvent.map(t => t.sold),
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(217, 70, 239, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(14, 165, 233, 0.8)',
            ],
            borderRadius: 8,
            borderSkipped: false,
        }],
    };

    const categoryData = {
        labels: ['Music', 'Tech', 'Food', 'Sports', 'Art', 'Business'],
        datasets: [{
            data: [30, 22, 18, 15, 10, 5],
            backgroundColor: [
                '#6366f1',
                '#d946ef',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#0ea5e9',
            ],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { family: 'Inter' },
                bodyFont: { family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 } } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 12 } } },
        },
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">Dashboard</h1>
                <p className="text-surface-500">Welcome back! Here's your overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <DashboardCard
                    title="Total Events"
                    value={stats.totalEvents}
                    icon={HiCalendarDays}
                    color="primary"
                    trend="up"
                    trendValue="+12%"
                />
                <DashboardCard
                    title="Total Bookings"
                    value={stats.totalBookings.toLocaleString()}
                    icon={HiTicket}
                    color="accent"
                    trend="up"
                    trendValue="+8%"
                />
                <DashboardCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={HiCurrencyRupee}
                    color="emerald"
                    trend="up"
                    trendValue="+15%"
                />
                <DashboardCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={HiUsers}
                    color="blue"
                    trend="up"
                    trendValue="+5%"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-surface-900">Revenue Overview</h3>
                            <p className="text-sm text-surface-500">Monthly revenue trend</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1 rounded-lg">
                            <HiArrowTrendingUp className="w-4 h-4" />
                            +15.3%
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Tickets Chart */}
                <div className="card p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-surface-900">Tickets by Event</h3>
                        <p className="text-sm text-surface-500">Ticket sales distribution</p>
                    </div>
                    <div className="h-64">
                        <Bar data={ticketsChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution */}
                <div className="card p-6">
                    <h3 className="font-bold text-surface-900 mb-2">Events by Category</h3>
                    <p className="text-sm text-surface-500 mb-4">Distribution breakdown</p>
                    <div className="h-48 flex items-center justify-center">
                        <Doughnut
                            data={categoryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '65%',
                                plugins: {
                                    legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { family: 'Inter', size: 11 } } },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="card p-6 lg:col-span-2">
                    <h3 className="font-bold text-surface-900 mb-4">Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" aria-label="Recent bookings">
                            <thead>
                                <tr className="text-left text-surface-500">
                                    <th className="pb-3 font-medium">Booking ID</th>
                                    <th className="pb-3 font-medium">Event</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {stats.recentBookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-3 font-mono text-primary-600 font-medium">{b.id}</td>
                                        <td className="py-3 text-surface-900 max-w-[200px] truncate">{b.eventTitle}</td>
                                        <td className="py-3 text-surface-500">{formatDateShort(b.bookingDate)}</td>
                                        <td className="py-3 font-semibold text-surface-900">{formatCurrency(b.grandTotal)}</td>
                                        <td className="py-3">
                                            <span className={`${getStatusColor(b.status)} capitalize`}>{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

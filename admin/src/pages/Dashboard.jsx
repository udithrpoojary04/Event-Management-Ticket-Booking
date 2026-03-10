import { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiBookOpen } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
        setLoading(false);
    };

    if (loading) return <div className="loading"><div className="spinner"></div>Loading dashboard...</div>;
    if (!stats) return <div className="loading">Failed to load dashboard data.</div>;

    const revenueChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue (₹)',
            data: stats.revenueByMonth,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6,
        }],
    };

    const ticketsChartData = {
        labels: stats.ticketsByEvent?.map(t => t.event) || [],
        datasets: [{
            data: stats.ticketsByEvent?.map(t => t.sold) || [],
            backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } },
        },
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 15, font: { size: 12 } } },
        },
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's an overview of your platform.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon purple"><FiCalendar /></div>
                    <div className="stat-info">
                        <h3>{stats.totalEvents}</h3>
                        <p>Total Events</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon green"><span style={{ fontSize: 20, fontWeight: 700 }}>₹</span></div>
                    <div className="stat-info">
                        <h3>₹{stats.totalRevenue?.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon blue"><FiBookOpen /></div>
                    <div className="stat-info">
                        <h3>{stats.totalBookings?.toLocaleString()}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon orange"><FiUsers /></div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers?.toLocaleString()}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Revenue Overview</h3>
                    <Bar data={revenueChartData} options={chartOptions} />
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Tickets by Event</h3>
                    <Doughnut data={ticketsChartData} options={doughnutOptions} />
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Recent Bookings</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>User</th>
                                <th>Ticket</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentBookings?.map((b, i) => (
                                <tr key={i}>
                                    <td>{b.eventTitle}</td>
                                    <td>{b.user?.name || 'N/A'}</td>
                                    <td>{b.ticketType} × {b.quantity}</td>
                                    <td>₹{b.grandTotal?.toFixed(2)}</td>
                                    <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                                </tr>
                            ))}
                            {(!stats.recentBookings || stats.recentBookings.length === 0) && (
                                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No bookings yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

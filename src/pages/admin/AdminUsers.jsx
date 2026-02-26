import EmptyState from '../../components/common/EmptyState';
import DashboardCard from '../../components/cards/DashboardCard';
import { HiUsers, HiChartBar, HiCog6Tooth, HiUserGroup } from 'react-icons/hi2';

const AdminUsers = () => {
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', bookings: 12, joined: '2025-12-10' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', bookings: 8, joined: '2026-01-05' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', bookings: 3, joined: '2025-11-22' },
        { id: 4, name: 'Sara Wilson', email: 'sara@example.com', role: 'user', bookings: 15, joined: '2026-01-18' },
        { id: 5, name: 'Alex Brown', email: 'alex@example.com', role: 'user', bookings: 6, joined: '2026-02-01' },
    ];

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">User Management</h1>
            <p className="text-surface-500 text-sm mb-6">View and manage registered users</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <DashboardCard title="Total Users" value="3,256" icon={HiUsers} color="primary" />
                <DashboardCard title="Active Users" value="2,890" icon={HiUserGroup} color="emerald" />
                <DashboardCard title="New This Month" value="148" icon={HiChartBar} color="accent" />
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" aria-label="Users list">
                        <thead className="bg-surface-50 border-b border-surface-100">
                            <tr>
                                <th className="text-left px-6 py-3 font-semibold text-surface-600">User</th>
                                <th className="text-left px-6 py-3 font-semibold text-surface-600 hidden sm:table-cell">Role</th>
                                <th className="text-left px-6 py-3 font-semibold text-surface-600 hidden md:table-cell">Bookings</th>
                                <th className="text-left px-6 py-3 font-semibold text-surface-600 hidden lg:table-cell">Joined</th>
                                <th className="text-right px-6 py-3 font-semibold text-surface-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-50">
                            {mockUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-surface-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff`}
                                                alt=""
                                                className="w-9 h-9 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-surface-900">{u.name}</p>
                                                <p className="text-xs text-surface-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className={`badge text-xs capitalize ${u.role === 'admin' ? 'badge-accent' : 'badge-primary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-surface-600 hidden md:table-cell">{u.bookings}</td>
                                    <td className="px-6 py-4 text-surface-500 hidden lg:table-cell">{u.joined}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" aria-label={`Manage ${u.name}`}>
                                            <HiCog6Tooth className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfile } from '../../services/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import {
    HiUser,
    HiEnvelope,
    HiPhone,
    HiMapPin,
    HiPencilSquare,
    HiCamera,
    HiTicket,
    HiCalendar,
    HiStar,
} from 'react-icons/hi2';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(form);
            updateUser(form);
            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: HiTicket, value: '12', label: 'Bookings', color: 'text-primary-500 bg-primary-100' },
        { icon: HiCalendar, value: '8', label: 'Events Attended', color: 'text-emerald-500 bg-emerald-100' },
        { icon: HiStar, value: '4.9', label: 'Rating', color: 'text-amber-500 bg-amber-100' },
    ];

    return (
        <div className="py-10 animate-fade-in">
            <div className="page-container max-w-4xl">
                {/* Header */}
                <div className="card overflow-hidden mb-8">
                    <div className="h-32 gradient-bg relative">
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <div className="px-8 pb-8 -mt-16 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                            <div className="relative">
                                <img
                                    src={user?.avatar || 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=120'}
                                    alt={user?.name}
                                    className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover"
                                />
                                <button
                                    className="absolute bottom-1 right-1 p-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors"
                                    aria-label="Change avatar"
                                >
                                    <HiCamera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-surface-900">{user?.name}</h1>
                                <p className="text-surface-500">{user?.email}</p>
                                <p className="text-sm text-surface-400 mt-1 capitalize">{user?.role} Account</p>
                            </div>
                            <Button
                                onClick={() => setEditing(!editing)}
                                variant={editing ? 'outline' : 'secondary'}
                                icon={HiPencilSquare}
                                size="sm"
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="card p-5 text-center">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                            <p className="text-sm text-surface-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Profile Info */}
                <div className="card p-8">
                    <h2 className="text-xl font-bold text-surface-900 mb-6">Personal Information</h2>
                    {editing ? (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Input label="Full Name" name="name" value={form.name} onChange={handleChange} icon={HiUser} required />
                                <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} icon={HiEnvelope} required />
                                <Input label="Phone" type="tel" name="phone" value={form.phone} onChange={handleChange} icon={HiPhone} />
                                <Input label="Location" name="location" value={form.location} onChange={handleChange} icon={HiMapPin} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button onClick={handleSave} loading={loading}>Save Changes</Button>
                                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: HiUser, label: 'Full Name', value: user?.name },
                                { icon: HiEnvelope, label: 'Email', value: user?.email },
                                { icon: HiPhone, label: 'Phone', value: user?.phone || 'Not provided' },
                                { icon: HiMapPin, label: 'Location', value: user?.location || 'Not provided' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="p-2 bg-surface-100 rounded-lg">
                                        <item.icon className="w-5 h-5 text-surface-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-400">{item.label}</p>
                                        <p className="font-medium text-surface-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

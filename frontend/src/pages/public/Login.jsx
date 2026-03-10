import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateEmail } from '../../utils/validators';
import { HiEnvelope, HiLockClosed } from 'react-icons/hi2';

const Login = () => {
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        const emailErr = validateEmail(form.email);
        if (emailErr) newErrors.email = emailErr;
        if (!form.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
        } catch (err) {
            toast.error('Invalid email or password');
            setErrors({ password: 'Invalid credentials. Try user@demo.com / any 4+ chars' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-surface-900">Welcome Back</h1>
                <p className="text-surface-500 mt-1">Sign in to your account</p>
            </div>

            {/* Demo credentials */}
            {/* <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-primary-700 mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs text-primary-600">
                    <p><strong>User:</strong> user@demo.com / pass</p>
                    <p><strong>Admin:</strong> admin@demo.com / pass</p>
                </div>
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={HiEnvelope}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={HiLockClosed}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-surface-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Sign In
                </Button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                    Create one free
                </Link>
            </p>
        </div>
    );
};

export default Login;

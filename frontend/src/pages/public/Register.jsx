import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import { HiUser, HiEnvelope, HiLockClosed, HiPhone } from 'react-icons/hi2';

const Register = () => {
    const { register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        const nameErr = validateRequired(form.name, 'Full name');
        if (nameErr) newErrors.name = nameErr;
        const emailErr = validateEmail(form.email);
        if (emailErr) newErrors.email = emailErr;
        const passErr = validatePassword(form.password);
        if (passErr) newErrors.password = passErr;
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    Create Account
                </h1>
                <p className="text-white/60 mt-2 font-medium">Join thousands of event enthusiasts</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={HiUser}
                    placeholder="John Doe"
                    required
                />
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
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    icon={HiPhone}
                    placeholder="+1 234 567 890"
                    helper="Optional"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={HiLockClosed}
                    placeholder="Min 6 chars, 1 uppercase, 1 number"
                    required
                    autoComplete="new-password"
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={HiLockClosed}
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                />

                <div className="flex items-start gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500/50"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        required
                    />
                    <label htmlFor="terms" className="text-sm text-white/70 leading-relaxed">
                        I agree to the <a href="#" className="font-bold text-primary-400 hover:text-primary-300">Terms</a> and{' '}
                        <a href="#" className="font-bold text-primary-400 hover:text-primary-300">Privacy Policy</a>
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                    disabled={!acceptedTerms}
                >
                    Create Account
                </Button>
            </form>

            <p className="text-center text-sm text-white/60 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default Register;

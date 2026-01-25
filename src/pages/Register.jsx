import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../App';
import '../styles/Auth.css';
import Logo from '@/components/Logo';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function Register() {
    const navigate = useNavigate();
    const { post } = useRequest();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        if (!agreeToTerms) {
            showNotification('Please agree to the Terms of Service', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await post('/users/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
            });

            if (response && response.code) {
                showNotification(
                    response.message || 'Registration successful!',
                    'success'
                );
                navigate(routes.login);
            }
        } catch (error) {
            showNotification(error.message || 'Registration failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="auth-backdrop min-h-screen w-screen flex items-center justify-center p-4"
            style={{
                backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDi5AdYwQmpJ20fsINctp2JqZ2jNdzwDFWomWZ4muY-_-Xme2wySJFQyL6Nl47i_Wxn8RnlkkGlWEpCMsx8FZA7756BCH6kCdU1YjZ2mQeV8IWY3H-Kp4Y1X48_fq6zJtHZvb_RkGF--qxY6-osCtavwd5emMk2SM5N2KBjguWznu_QY9faLCmN7m5PNw9H7XxXsy6WKK7D5DbXQphgBGqRUntwbchMysYL6LMEjy11lBFwxovcIMTPpWc9xbWIS9ldHQWZZupQ_aGO")',
            }}
        >
            <div className="auth-form-container w-full max-w-md">
                <Logo />

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <h1 className="text-white text-3xl font-black mb-2">
                        Create Account
                    </h1>
                    <p className="text-white/60 mb-8">
                        Join us and start streaming
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="auth-input"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="auth-input"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                                    checked={agreeToTerms}
                                    onChange={(e) =>
                                        setAgreeToTerms(e.target.checked)
                                    }
                                />
                                <span className="text-white/70 text-sm">
                                    I agree to the{' '}
                                    <a
                                        href="#"
                                        className="text-primary hover:underline"
                                    >
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href="#"
                                        className="text-primary hover:underline"
                                    >
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="auth-button-primary mt-6"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Creating Account...'
                                : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Already have an account?{' '}
                            <Link
                                to={routes.login}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <span className="material-symbols-outlined text-primary text-2xl mb-1">
                            4k
                        </span>
                        <p className="text-white/60 text-xs">4K Quality</p>
                    </div>
                    <div>
                        <span className="material-symbols-outlined text-primary text-2xl mb-1">
                            devices
                        </span>
                        <p className="text-white/60 text-xs">All Devices</p>
                    </div>
                    <div>
                        <span className="material-symbols-outlined text-primary text-2xl mb-1">
                            download
                        </span>
                        <p className="text-white/60 text-xs">Download</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

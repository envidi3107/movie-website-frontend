import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../App';
import '../styles/Auth.css';
import Logo from '@/components/Logo';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthProviderContext';

export default function Login() {
    const navigate = useNavigate();
    const { post, get } = useRequest();
    const { showNotification } = useNotification();
    const { updateAuthUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            // Login API call
            const response = await post('/auth/login', {
                email,
                password,
            });

            if (response && response.results && response.results.token) {
                // Store token in localStorage
                localStorage.setItem('token', response.results.token);

                showNotification(
                    response.message || 'Login successful!',
                    'success'
                );

                // Fetch user info
                const userInfoResponse = await get('/users/my-info');

                if (userInfoResponse && userInfoResponse.results) {
                    // Update auth context with user data
                    updateAuthUser(userInfoResponse.results);

                    // Navigate to home
                    navigate(routes.home);
                }
            }
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="auth-backdrop min-h-screen w-screen flex items-center justify-center p-4"
            style={{
                backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB02s931nwuY3g0u8jsiAJGdwQNG1G7JgFSGSPmW56BlWL1kwoKCr3yFkHKl1PXFtwrYghpupKUV6rAuoWjAM5uhvkU19Oq44SQ7pcvoVTgDf6n9M9U3HkdQ_VuiEL0G6NJzvu82j8sbsnb0By0Tp_BpkgVFoF_NTIeTZtZR6f5UdWIqqMk6m_mwtDU4Vr135Js-DX2gDYQklLgm5pkxhdtYMRGxW-RsvYPW-5ofYRBK0A27p9UcOuTfikH9BYGb_cl7X35fk2VfE83")',
            }}
        >
            <div className="auth-form-container w-full max-w-md">
                {/* Logo */}
                <Logo />

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <h1 className="text-white text-3xl font-black mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-white/60 mb-8">
                        Sign in to continue watching
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Email
                            </label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <span className="text-white/70 text-sm">
                                    Remember me
                                </span>
                            </label>
                            <a
                                href="#"
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="auth-button-primary mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to={routes.register}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-white/40 text-xs">
                        By signing in, you agree to our{' '}
                        <a
                            href="#"
                            className="text-white/60 hover:text-white underline"
                        >
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                            href="#"
                            className="text-white/60 hover:text-white underline"
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

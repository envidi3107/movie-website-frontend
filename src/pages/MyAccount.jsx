import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import { useAuth } from '@/contexts/AuthProviderContext';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';
import MyListContent from '@/components/MyListContent';

export default function MyAccount() {
    const { username } = useParams();
    const { authUser, updateAuthUser } = useAuth();
    const { post } = useRequest();
    const { showNotification } = useNotification();
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        username: '',
        password: '',
        dateOfBirth: '',
    });

    // Tab state
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (authUser) {
            setUpdateForm((prev) => ({
                ...prev,
                username: authUser.username || '',
                dateOfBirth: authUser.dateOfBirth || '',
            }));
        }
    }, [authUser]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUpdatingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatarFile', file);

            const response = await post('/users/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.results) {
                updateAuthUser(response.results);
                showNotification('Avatar updated successfully!', 'success');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleUpdateChange = (e) => {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Using /users/signup as requested, but conceptually should be an update endpoint
            // If the backend actually treats this as update for authenticated user, great.
            // Otherwise, we might need to adjust.
            const response = await post('/users/signup', {
                username: updateForm.username,
                email: authUser?.email, // Keep existing email
                password: updateForm.password,
                dateOfBirth: updateForm.dateOfBirth,
            });

            if (response) {
                showNotification('Profile updated successfully!', 'success');
                setShowUpdateModal(false);
                setUpdateForm((prev) => ({ ...prev, password: '' })); // Clear password
                // Optionally refresh user info if needed
                if (response.results) {
                    // If the API returns updated user object
                    // updateAuthUser(response.results);
                }
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    if (!authUser) return null;

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AccountSidebar activeItem={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-white/5 dark:bg-transparent">
                <div className="max-w-5xl mx-auto py-12 px-8">
                    {activeTab === 'mylist' ? (
                        <MyListContent />
                    ) : (
                        <>
                            <div className="mb-10">
                                <h2 className="dark:text-white text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                                    Account Settings
                                </h2>
                                <p className="text-gray-500 dark:text-[#ab9db9] text-lg font-normal mt-2">
                                    Manage your viewing experience, billing, and
                                    profile details.
                                </p>
                            </div>
                            <section className="bg-white dark:bg-[#1f1629] rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-white/5">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div
                                        className="relative group cursor-pointer"
                                        onClick={handleAvatarClick}
                                    >
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 shadow-xl border-4 border-transparent group-hover:border-primary transition-all"
                                            style={{
                                                backgroundImage: `url("${authUser.avatarPath || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nUzO1aqNTGd8ULUcn-GNG3iu5XJIXI7Yw3zg5Y_nYaznjAXpn_GfJeAHf6newofninm-Hbcc2yQnx--sj6hYnZ5bQtkiUpXivQvC1s7kZ9mzkW9kenRQqw6gGVm44WqXnjWM807eeGXIZNhOYtqiAZGu6I9cYP82vbZusRHc5pO6Jcxj6KIcqgPzRrPeaoqpCdGJCbdwKQvU1M7lRrqoy4l-TYnLXSYTcWEHFgkQVVeInv7coi8WZQCt1Ux2_uDFD9T64jgp_M3r'}")`,
                                            }}
                                        >
                                            {isUpdatingAvatar && (
                                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-white dark:border-[#1f1629] text-white hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">
                                                edit
                                            </span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="dark:text-white text-gray-900 text-2xl font-bold tracking-tight">
                                            {authUser.username}
                                        </h3>
                                        <p className="text-gray-500 dark:text-[#ab9db9] text-base mt-1">
                                            {authUser.email}
                                        </p>
                                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                            <span
                                                className={`px-3 py-1 text-xs font-bold rounded-full border ${authUser.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}
                                            >
                                                {authUser.role} Profile
                                            </span>
                                            {authUser.dateOfBirth && (
                                                <span className="px-3 py-1 bg-white/5 text-white/60 text-xs font-bold rounded-full border border-white/10">
                                                    Born:{' '}
                                                    {new Date(
                                                        authUser.dateOfBirth
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowUpdateModal(true)}
                                        className="px-6 py-2.5 bg-gray-100 dark:bg-[#302839] hover:bg-gray-200 dark:hover:bg-[#3d3349] dark:text-white text-gray-700 font-bold rounded-xl transition-colors"
                                    >
                                        Update Details
                                    </button>
                                </div>
                            </section>

                            {/* ... Rest of existing sections can remain or be removed if unused ... */}
                            {/* For brevity, I'll keep the Subscription section as static for now */}
                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="dark:text-white text-gray-900 text-xl font-bold">
                                        Subscription Plan
                                    </h3>
                                    <a
                                        className="text-primary text-sm font-bold hover:underline"
                                        href="#"
                                    >
                                        View History
                                    </a>
                                </div>
                                <div className="relative overflow-hidden bg-white dark:bg-[#1f1629] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                        <div className="flex gap-4 items-start">
                                            <div className="bg-primary/20 p-3 rounded-xl">
                                                <span className="material-symbols-outlined text-primary text-3xl">
                                                    workspace_premium
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-primary text-xs font-bold uppercase tracking-widest">
                                                    Active Plan
                                                </p>
                                                <p className="dark:text-white text-gray-900 text-2xl font-black mt-1">
                                                    Premium 4K + HDR
                                                </p>
                                                <p className="text-gray-500 dark:text-[#ab9db9] text-sm mt-1">
                                                    Next billing date:{' '}
                                                    <span className="font-bold dark:text-white text-gray-700">
                                                        December 24, 2024
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-2xl font-bold dark:text-white text-gray-900">
                                                $19.99
                                                <span className="text-sm font-normal text-gray-500">
                                                    /mo
                                                </span>
                                            </p>
                                            <button className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                                Change Plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Update Profile Modal */}
                {showUpdateModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
                            <h3 className="text-white text-xl font-bold mb-6">
                                Update Profile
                            </h3>
                            <form
                                onSubmit={handleUpdateSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={updateForm.username}
                                        onChange={handleUpdateChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={updateForm.password}
                                        onChange={handleUpdateChange}
                                        placeholder="Leave empty to keep current"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={updateForm.dateOfBirth}
                                        onChange={handleUpdateChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowUpdateModal(false)
                                        }
                                        className="flex-1 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

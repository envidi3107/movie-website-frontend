import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { routes } from '@/App';
import { useAuth } from '@/contexts/AuthProviderContext';
import useNotificationService from '@/hooks/useNotificationService';
import { useNotification } from '@/contexts/NotificationContext';

export default function Navbar() {
    const isLogin = localStorage.getItem('token');
    const { authUser, updateAuthUser, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const notiDropdownRef = useRef(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { getAllNotifications, deleteNotification, clearAllNotifications } =
        useNotificationService();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
            if (
                notiDropdownRef.current &&
                !notiDropdownRef.current.contains(event.target)
            ) {
                setIsNotiDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isLogin) {
            fetchNotifications();
        }
    }, [isLogin]);

    const fetchNotifications = async () => {
        const res = await getAllNotifications();
        // Handle different response structures
        const data =
            res?.data || res?.results || (Array.isArray(res) ? res : []);
        setNotifications(data);
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
    };

    const handleClearAllResults = async () => {
        await clearAllNotifications();
        setNotifications([]);
    };

    const handleLogout = () => {
        signOut();
        setIsDropdownOpen(false);
    };

    const handleMyAccount = () => {
        setIsDropdownOpen(false);
        navigate(routes.myAccount(authUser?.username || 'user'));
    };

    const handleManageMovies = () => {
        setIsDropdownOpen(false);
        navigate(routes.admin.dashboard);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-6 lg:px-12 py-3 flex items-center justify-between">
            <div className="flex items-center gap-10">
                <Logo />
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        to={routes.default}
                        className="text-white/70 hover:text-white text-sm font-semibold transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to={routes.movies}
                        className="text-white/70 hover:text-white text-sm font-semibold transition-colors"
                    >
                        Movies
                    </Link>
                    <Link
                        to={routes.tvShows}
                        className="text-white/70 hover:text-white text-sm font-semibold transition-colors"
                    >
                        TV Shows
                    </Link>
                    <Link
                        to={routes.myList}
                        className="text-white/70 hover:text-white text-sm font-semibold transition-colors"
                    >
                        My List
                    </Link>
                </nav>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex gap-[7px] items-center bg-white/10 rounded-lg px-3 py-1.5 border border-white/10 focus-within:border-primary/50 transition-all">
                    <span className="material-symbols-outlined text-white/50 text-xl">
                        search
                    </span>
                    <input
                        className="bg-transparent border-none outline-none focus:ring-0 text-sm text-white placeholder:text-white/40 w-48"
                        placeholder="Titles, people, genres"
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                                navigate(
                                    routes.search +
                                        `?q=${encodeURIComponent(e.target.value.trim())}`
                                );
                                e.target.value = ''; // Optional: clear after search? Or keep it? keeping it might be better but I'll clear or leave it.
                                // Actually, controlled input is better, but unconditional uncontrolled is easier here as I didn't add state yet.
                                // Let's just use e.target.value directly.
                            }
                        }}
                    />
                </div>
                <div className="relative" ref={notiDropdownRef}>
                    <button
                        className="relative text-white/70 hover:text-white transition-colors mt-2"
                        onClick={() =>
                            setIsNotiDropdownOpen(!isNotiDropdownOpen)
                        }
                    >
                        <span className="material-symbols-outlined text-2xl">
                            notifications
                        </span>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full px-1 border-2 border-[#0f0f0f]">
                                {notifications.length > 9
                                    ? '9+'
                                    : notifications.length}
                            </span>
                        )}
                    </button>

                    {isNotiDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-[#1a0b2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ease-out z-100">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-white font-bold text-sm">
                                    Notifications
                                </h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleClearAllResults}
                                        className="text-xs text-primary hover:text-primary/80 font-bold transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((noti) => (
                                        <div
                                            key={noti.notificationId}
                                            className="flex gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 relative group"
                                        >
                                            <div className="shrink-0 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-200 leading-relaxed">
                                                    {noti.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        noti.createdAt
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) =>
                                                    handleDeleteNotification(
                                                        noti.notificationId,
                                                        e
                                                    )
                                                }
                                                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    close
                                                </span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                                            notifications_off
                                        </span>
                                        <p className="text-sm">
                                            No notifications
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {isLogin ? (
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-gray-500"
                            data-alt="User profile avatar close up photo"
                            style={{
                                backgroundImage: `url("${authUser?.avatarPath || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nUzO1aqNTGd8ULUcn-GNG3iu5XJIXI7Yw3zg5Y_nYaznjAXpn_GfJeAHf6newofninm-Hbcc2yQnx--sj6hYnZ5bQtkiUpXivQvC1s7kZ9mzkW9kenRQqw6gGVm44WqXnjWM807eeGXIZNhOYtqiAZGu6I9cYP82vbZusRHc5pO6Jcxj6KIcqgPzRrPeaoqpCdGJCbdwKQvU1M7lRrqoy4l-TYnLXSYTcWEHFgkQVVeInv7coi8WZQCt1Ux2_uDFD9T64jgp_M3r'}")`,
                            }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        ></div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-[#1a0b2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ease-out">
                                {/* User Info */}
                                {authUser && (
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-white font-semibold text-sm truncate">
                                            {authUser.username}
                                        </p>
                                        <p className="text-white/60 text-xs truncate">
                                            {authUser.email}
                                        </p>
                                    </div>
                                )}

                                {/* Menu Items */}
                                <div className="py-2 select-none">
                                    <button
                                        onClick={handleMyAccount}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            person
                                        </span>
                                        <span className="text-sm font-medium">
                                            Tài khoản của tôi
                                        </span>
                                    </button>

                                    {authUser?.role === 'ADMIN' && (
                                        <button
                                            onClick={handleManageMovies}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                movie
                                            </span>
                                            <span className="text-sm font-medium">
                                                Quản lý phim
                                            </span>
                                        </button>
                                    )}

                                    <div className="border-t border-white/10 my-2"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-400/10 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            logout
                                        </span>
                                        <span className="text-sm font-medium">
                                            Đăng xuất
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to={routes.login}
                            className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-white transition-colors px-6 py-2.5 rounded-lg"
                        >
                            Login
                        </Link>
                        <Link
                            to={routes.register}
                            className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-white transition-colors px-6 py-2.5 rounded-lg"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

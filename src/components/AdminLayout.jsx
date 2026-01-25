import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProviderContext';
import Logo from './Logo';

export default function AdminLayout() {
    const { authUser } = useAuth();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Redirect if not admin
    if (!authUser || authUser.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/upload', icon: 'upload', label: 'Upload Movie' },
        { path: '/admin/movies', icon: 'movie', label: 'Movies' },
        { path: '/admin/users', icon: 'group', label: 'Users' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-background-dark overflow-hidden w-screen">
            {/* Sidebar */}
            <aside
                className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 bg-[#1a0b2e] border-r border-white/10 flex flex-col transition-all duration-300`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    {!isSidebarCollapsed ? (
                        <div className="flex items-center justify-between">
                            <Logo />
                            <button
                                onClick={() => setIsSidebarCollapsed(true)}
                                className="text-white/70 hover:text-white"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_left
                                </span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="text-white/70 hover:text-white mx-auto block"
                        >
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive(item.path)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {item.icon}
                            </span>
                            {!isSidebarCollapsed && (
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/10">
                    {!isSidebarCollapsed ? (
                        <div className="flex items-center gap-3 px-2">
                            <div className="bg-primary rounded-full p-2">
                                <span className="material-symbols-outlined text-white">
                                    admin_panel_settings
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {authUser.username}
                                </p>
                                <p className="text-primary text-xs font-semibold uppercase">
                                    Admin
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-primary rounded-full p-2 mx-auto w-fit">
                            <span className="material-symbols-outlined text-white">
                                admin_panel_settings
                            </span>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background-dark">
                <Outlet />
            </main>
        </div>
    );
}

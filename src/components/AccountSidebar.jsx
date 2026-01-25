import { useNavigate } from 'react-router-dom';
import { routes } from '../App';
import { useAuth } from '@/contexts/AuthProviderContext';
import Logo from './Logo';

export default function AccountSidebar({
    activeItem = 'profile',
    onTabChange,
}) {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <aside className="w-72 shrink-0 border-r border-white/5 bg-background-light dark:bg-background-dark flex flex-col justify-between p-6">
            <div className="flex flex-col gap-8">
                {/* Brand/Logo */}
                <div className="flex items-center gap-3 px-2">
                    <Logo />
                </div>

                <div className="flex flex-col gap-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary ring-offset-2 ring-offset-background-dark"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWGKVoOuCmErwsNcslqFnFdRi7ht5oM8L2Y9K4kv36y7cerhtN5KeX1EJy3RqMr2xahml5gtXDYQBCZDKBcqm8gncNqwblJh0fItpk_mNydBxmQ7q8fCidbyAV8JgpQs1DtQkBl_ctjnu1I4NkuB-e3qPhNFU-XG4DMT8BkYEgTA0NGTpvnKzLJSgCC556liok0hdu82RY6E9i7i5_vw738YeXpnrvkzIZ3IhYg5lfV99J6TX2PZB2YbAQ-LOmG881fmtDawW9WIsH")',
                            }}
                        ></div>
                        <div className="flex flex-col">
                            <h1 className="dark:text-white text-gray-900 text-base font-bold leading-none">
                                Alex Morgan
                            </h1>
                            <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1">
                                Premium Member
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <div
                            className={`account-nav-item ${activeItem === 'profile' ? 'active' : ''} cursor-pointer`}
                            onClick={() =>
                                onTabChange && onTabChange('profile')
                            }
                        >
                            <span className="material-symbols-outlined">
                                person
                            </span>
                            <p className="text-sm font-medium">
                                Profile Settings
                            </p>
                        </div>
                        <div
                            className={`account-nav-item ${activeItem === 'subscription' ? 'active' : ''} cursor-pointer`}
                            onClick={() =>
                                onTabChange && onTabChange('subscription')
                            }
                        >
                            <span className="material-symbols-outlined">
                                payments
                            </span>
                            <p className="text-sm font-medium">Subscription</p>
                        </div>
                        <div
                            className={`account-nav-item ${activeItem === 'security' ? 'active' : ''} cursor-pointer`}
                            onClick={() =>
                                onTabChange && onTabChange('security')
                            }
                        >
                            <span className="material-symbols-outlined">
                                security
                            </span>
                            <p className="text-sm font-medium">
                                Security & Privacy
                            </p>
                        </div>
                        <div
                            className={`account-nav-item ${activeItem === 'parental' ? 'active' : ''} cursor-pointer`}
                            onClick={() =>
                                onTabChange && onTabChange('parental')
                            }
                        >
                            <span className="material-symbols-outlined">
                                family_history
                            </span>
                            <p className="text-sm font-medium">
                                Parental Controls
                            </p>
                        </div>
                        <div
                            className={`account-nav-item ${activeItem === 'mylist' ? 'active' : ''} cursor-pointer`}
                            onClick={() => onTabChange && onTabChange('mylist')}
                        >
                            <span className="material-symbols-outlined">
                                list
                            </span>
                            <p className="text-sm font-medium">My List</p>
                        </div>
                        <div
                            className={`account-nav-item ${activeItem === 'playback' ? 'active' : ''} cursor-pointer`}
                            onClick={() =>
                                onTabChange && onTabChange('playback')
                            }
                        >
                            <span className="material-symbols-outlined">
                                settings_suggest
                            </span>
                            <p className="text-sm font-medium">
                                Playback Settings
                            </p>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Sign Out */}
            <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
                <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                    onClick={handleSignOut}
                >
                    <span className="material-symbols-outlined">logout</span>
                    <p className="text-sm font-medium">Sign Out</p>
                </div>
            </div>
        </aside>
    );
}

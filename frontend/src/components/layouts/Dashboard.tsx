import { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import { fetchUserProfile } from '../../api/auth/userService';
import spadaLogo from '../../assets/logos/spada.png';

import {
    LuLayoutGrid,
    LuCalendar,
    LuUsers,
    LuDatabase,
    LuSettings,
    LuLogOut,
    LuMenu,
    LuBell,
    LuGlobe,
    LuClipboardList,
    LuChevronDown,
} from 'react-icons/lu';

interface LanguageContextType {
    language: string;
    changeLanguage: (lang: string) => void;
}

type NavItem = {
    label: string;
    path?: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    children?: { label: string; path: string }[];
};

// 👇 UPDATED navItems
const navItems: NavItem[] = [
    {
        label: 'Predictions',
        icon: LuLayoutGrid,
        children: [
            { label: 'NBA', path: '/dashboard/predictNBA' },
            { label: 'NFL', path: '/dashboard/predictNFL' },
        ],
    },
    { label: 'Calender', path: '/dashboard/calendar', icon: LuCalendar },
    { label: 'Community', path: '/dashboard/community', icon: LuUsers },
    { label: 'Binnacle', path: '/dashboard/binnacle', icon: LuClipboardList },
    { label: 'Stats', path: '/dashboard/stats', icon: LuDatabase },
    { label: 'Settings', path: '/dashboard/settings', icon: LuSettings },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Guest', email: 'user@spada.com' });
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser({
                        name: parsedUser.name || 'User',
                        email: parsedUser.email || 'user@spada.com',
                    });
                    return;
                } catch (e) {
                    console.error('Error parsing user data', e);
                }
            }

            // 2. If not in storage, try fetching from API using the token
            const tokenExists =
                localStorage.getItem('auth_tokens') || localStorage.getItem('token');

            if (tokenExists) {
                try {
                    const apiUser = await fetchUserProfile();

                    if (apiUser) {
                        const normalizedUser = {
                            name: apiUser.username || 'User',
                            email: apiUser.email || 'user@spada.com',
                        };

                        setUser(normalizedUser);
                        localStorage.setItem('user', JSON.stringify(normalizedUser));
                    }
                } catch (error) {
                    console.error('Failed to load user from API', error);
                }
            }
        };

        loadUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_tokens');
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#0B0A17]/95 backdrop-blur-xl transition-transform translate-x-0 hidden md:flex flex-col">
            <div className="flex h-16 items-center border-b border-white/10 px-3">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                    <img
                        src={spadaLogo}
                        alt="SPADA Logo"
                        className="h-8 w-8 object-contain rounded-lg"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <span>SPADA</span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    const hasChildren = !!item.children && item.children.length > 0;

                    // active if the current path matches this item or one of its children
                    const isChildActive =
                        hasChildren &&
                        item.children!.some((child) => location.pathname.startsWith(child.path));

                    const isActive = item.path
                        ? location.pathname.startsWith(item.path)
                        : !!isChildActive;

                    if (hasChildren) {
                        // Parent item with dropdown
                        const isOpen = openDropdown === item.label;

                        return (
                            <div key={item.label} className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenDropdown((prev) =>
                                            prev === item.label ? null : item.label,
                                        )
                                    }
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                            ${
                                isActive
                                    ? 'bg-white/10 text-white shadow-[0_1px_10px_rgba(255,255,255,0.1)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon
                                            size={20}
                                            className={`${
                                                isActive
                                                    ? 'text-indigo-400'
                                                    : 'text-gray-500 group-hover:text-gray-300'
                                            }`}
                                        />
                                        {item.label}
                                    </span>
                                    <LuChevronDown
                                        size={16}
                                        className={`transition-transform ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Children links */}
                                {isOpen && (
                                    <div className="ml-8 space-y-1">
                                        {item.children!.map((child) => {
                                            const childActive = location.pathname.startsWith(
                                                child.path,
                                            );
                                            return (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    className={`flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-all
                                            ${
                                                childActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Normal single link
                    return (
                        <Link
                            key={item.path}
                            to={item.path!}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    ${
                        isActive
                            ? 'bg-white/10 text-white shadow-[0_1px_10px_rgba(255,255,255,0.1)]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                        >
                            <Icon
                                size={20}
                                className={`${
                                    isActive
                                        ? 'text-indigo-400'
                                        : 'text-gray-500 group-hover:text-gray-300'
                                }`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition group relative">
                    <div className="h-9 w-9 rounded-full bg-linear-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-white group-hover:text-indigo-300 transition">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">{user.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/10 transition"
                    >
                        <LuLogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default function DashboardLayout() {
    const context = useContext(LanguageContext) as LanguageContextType | null;

    const { language, changeLanguage } = context || {
        language: 'es',
        changeLanguage: () => {},
    };

    return (
        <div className="min-h-screen bg-[#0B0A17] text-gray-100 font-sans">
            <Sidebar />
            <div className="md:pl-64 transition-all duration-300">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0B0A17]/80 px-6 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-1 text-gray-400 hover:text-white">
                            <LuMenu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold text-white">
                            {language === 'es' ? 'Panel de Control' : 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
                            <LuGlobe size={16} className="text-indigo-400" />
                            <select
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
                            >
                                <option value="es" className="bg-[#0B0A17]">
                                    Español
                                </option>
                                <option value="en" className="bg-[#0B0A17]">
                                    English
                                </option>
                            </select>
                        </div>
                        <button className="relative p-2 text-gray-400 hover:text-white transition">
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B0A17]" />
                            <LuBell size={20} />
                        </button>
                    </div>
                </header>
                <main className="p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

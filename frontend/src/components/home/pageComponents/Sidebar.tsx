import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Overview', path: '/mainHome', icon: 'grid' },
    { label: 'Users', path: '/users', icon: 'users' },
    { label: 'Database', path: '/database', icon: 'database' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#0B0A17]/95 backdrop-blur-xl transition-transform md:translate-x-0">
            {/* Logo Area */}
            <div className="flex h-16 items-center border-b border-white/10 px-6">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600" />
                    <span>RenderDB</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                                ${
                                    isActive
                                        ? 'bg-white/10 text-white shadow-[0_1px_10px_rgba(255,255,255,0.1)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon name={item.icon} isActive={isActive} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Snippet (Bottom) */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400" />
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-white">Demo Admin</p>
                        <p className="truncate text-xs text-gray-400">admin@render.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

// Simple Icon wrapper to avoid external dependencies for this preview
function Icon({ name, isActive }: { name: string; isActive: boolean }) {
    const colorClass = isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300';

    // Simple SVG paths for demo
    const icons: Record<string, React.ReactNode> = {
        grid: <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" />,
        users: (
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M23 21v-2a4 4 0 0 0-3-3.87" />
        ),
        database: (
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5c0 1.66 4 3 9 3s9-1.34 9-3M21 12c0 1.66-4 3-9 3s-9-1.34-9-3v7c0 1.66 4 3 9 3s9-1.34 9-3v-7z" />
        ),
        settings: <circle cx="12" cy="12" r="3" />,
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-5 w-5 transition-colors ${colorClass}`}
        >
            {icons[name] || icons.grid}
        </svg>
    );
}

import { Outlet } from 'react-router-dom';
import Sidebar from './pageComponents/Sidebar';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#0B0A17] text-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="md:pl-64 transition-all duration-300">
                {/* Top Header (Mobile Toggle + Title) */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0B0A17]/80 px-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white">Dashboard</h2>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition">
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B0A17]" />
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Page Content Injection Point */}
                <main className="p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

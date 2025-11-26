import { useState, useEffect } from 'react';
import {
    fetchUserProfile,
    updateUserProfile,
    type UserProfile,
} from '../../../api/serviceUser/userService'; // Adjust path
import {
    LuUser,
    LuMail,
    LuShield,
    LuActivity,
    LuSave,
    LuLoader,
    LuCamera,
    LuLock,
    LuImage,
    LuCheckCheck,
    LuBadgeAlert,
} from 'react-icons/lu';

export default function Settings() {
    // State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
        null,
    );

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        avatarUrl: '',
        password: '',
    });

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await fetchUserProfile();
                if (userData) {
                    setUser(userData);
                    setFormData((prev) => ({
                        ...prev,
                        username: userData.username || '',
                        avatarUrl: userData.avatarUrl || '',
                    }));
                }
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage(null);

        try {
            const updatedUser = await updateUserProfile(user.id, {
                username: formData.username,
                avatarUrl: formData.avatarUrl,
                password: formData.password || undefined, // Only send if typed
            });

            setUser(updatedUser);
            setFormData((prev) => ({ ...prev, password: '' })); // Clear password field
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    // Helper for Status/Role colors
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'suspended':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            default:
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-400">
                <LuLoader className="animate-spin mr-2" size={24} />
                Loading Profile...
            </div>
        );
    }

    if (!user) {
        return <div className="text-center text-red-400 mt-10">User not found. Please log in.</div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-gray-400 text-md mt-1">
                        Manage your personal information and security
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/5 bg-[#0B0A17]/80 h-full flex flex-col items-center text-center relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                        {/* Avatar */}
                        <div className="relative mb-6 mt-4">
                            <div className="w-40 h-40 rounded-full border-4 border-[#0B0A17] shadow-[0_0_20px_rgba(99,102,241,0.3)] overflow-hidden bg-white/5 flex items-center justify-center ring-2 ring-white/10">
                                {formData.avatarUrl ? (
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://ui-avatars.com/api/?name=' +
                                                user.username +
                                                '&background=random';
                                        }}
                                    />
                                ) : (
                                    <LuUser size={64} className="text-white/20" />
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full border-4 border-[#0B0A17] text-white">
                                <LuCamera size={16} />
                            </div>
                        </div>

                        {/* Name & Email */}
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {user.username || 'Anonymous User'}
                        </h2>
                        <p className="text-gray-500 font-mono text-sm mb-6 flex items-center gap-2 justify-center">
                            <LuMail size={14} />
                            {user.email}
                        </p>

                        {/* Badges */}
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                    <LuShield size={16} /> Role
                                </span>
                                <span className="text-indigo-300 font-bold uppercase text-xs tracking-wider px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                    <LuActivity size={16} /> Status
                                </span>
                                <span
                                    className={`font-bold uppercase text-xs tracking-wider px-2 py-1 rounded border ${getStatusColor(
                                        user.status ?? 'unknown',
                                    )}`}
                                >
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.15)] border border-white/5 bg-[#0B0A17]/80 h-full flex flex-col justify-between"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <LuUser className="text-indigo-400" />
                                    Edit Profile
                                </h3>
                                {message && (
                                    <div
                                        className={`text-sm px-3 py-1 rounded-full flex items-center gap-2 ${
                                            message.type === 'success'
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-red-500/20 text-red-300'
                                        }`}
                                    >
                                        {message.type === 'success' ? (
                                            <LuCheckCheck />
                                        ) : (
                                            <LuBadgeAlert />
                                        )}
                                        {message.text}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username Input */}
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm font-medium ml-1">
                                        Username
                                    </label>
                                    <div className="relative group">
                                        <LuUser
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                            className="w-full bg-[#0B0A17] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Avatar URL Input */}
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm font-medium ml-1">
                                        Avatar URL
                                    </label>
                                    <div className="relative group">
                                        <LuImage
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            name="avatarUrl"
                                            value={formData.avatarUrl}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full bg-[#0B0A17] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Password Input - Full Width */}
                                <div className="col-span-1 md:col-span-2 space-y-2 pt-2">
                                    <label className="text-gray-400 text-sm font-medium ml-1 flex justify-between">
                                        New Password
                                        <span className="text-xs text-gray-600 font-normal italic">
                                            Leave blank to keep current
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <LuLock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
                                            size={20}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••••••"
                                            className="w-full bg-[#0B0A17] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-white/10 pt-6 mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {saving ? (
                                    <>
                                        <LuLoader className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <LuSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

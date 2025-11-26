import React, { useEffect, useState } from 'react';
import {
    fetchMyBets,
    fetchBetStats,
    createBet,
    settleBet,
    type SportLeague,
    type BetStatus,
} from '../../../api/serviceBets/betsService'; // Check your path matches your folder structure
import {
    LuTrendingUp,
    LuPlus,
    LuDollarSign,
    LuActivity,
    LuCheckCheck,
    LuCircle,
    LuTrophy,
    LuCalendar,
    LuLoader,
    LuTarget,
    LuPercent,
    LuHash,
    //LuFilter,
} from 'react-icons/lu';

// --- CONFIGURATION ---
const USER_ID = '2413091b-773b-4819-8f1d-e4eb0e589054';

// --- TYPES (UI layer) ---
interface Bet {
    id: string;
    userId: string;
    matchTitle: string;
    league: SportLeague;
    stake: number;
    odds: number;
    evPercent?: number | null;
    status: BetStatus;
    createdAt: string;
    profit?: number | string | null;
}

interface BetStats {
    totalProfit: number;
    totalBets: number;
    totalStake?: number;
}

type FilterOption = 'ALL' | 'PENDING' | 'SETTLED';

export default function Binnacle() {
    // --- STATE ---
    const [bets, setBets] = useState<Bet[]>([]);
    const [stats, setStats] = useState<BetStats>({ totalProfit: 0, totalBets: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL');

    // Form State
    const [formData, setFormData] = useState<{
        stake: string;
        odds: string;
        matchTitle: string;
        league: SportLeague;
        evPercent: string;
    }>({
        stake: '',
        odds: '',
        matchTitle: '',
        league: 'NBA' as SportLeague,
        evPercent: '',
    });

    // --- DATA LOADING ---
    const loadData = async () => {
        try {
            const [myBets, myStats] = await Promise.all([
                fetchMyBets(USER_ID),
                fetchBetStats(USER_ID),
            ]);
            setBets(myBets);
            setStats(myStats);
        } catch (err) {
            console.error('Failed to load binnacle:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createBet({
                userId: USER_ID,
                stake: Number(formData.stake),
                odds: Number(formData.odds),
                matchTitle: formData.matchTitle,
                league: formData.league,
                matchId: `manual-${Date.now()}`,
                evPercent: formData.evPercent ? Number(formData.evPercent) : undefined,
            });

            setShowForm(false);
            setFormData({
                stake: '',
                odds: '',
                matchTitle: '',
                league: 'NBA' as SportLeague,
                evPercent: '',
            });
            await loadData();
        } catch (err) {
            console.error(err);
            alert('Error placing bet');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSettle = async (betId: string, status: BetStatus) => {
        const oldBets = [...bets];
        // Optimistic Update
        setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, status } : b)));

        try {
            await settleBet(betId, { userId: USER_ID, status });
            await loadData();
        } catch (err) {
            console.error(err);
            setBets(oldBets);
            alert('Failed to settle bet');
        }
    };

    // --- HELPERS ---
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // --- FILTER LOGIC ---
    const filteredBets = bets.filter((bet) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return bet.status === 'PENDING';
        if (activeFilter === 'SETTLED') return bet.status !== 'PENDING';
        return true;
    });

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center bg-[#1a1d21] text-[#a3b3cc]">
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="animate-spin text-[#d08770]" size={48} />
                    <span className="animate-pulse">Loading Bankroll...</span>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#1a1d21] text-[#eceff4] font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-[#2e3440]">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#d08770]">
                            My Binnacle
                        </h1>
                        <p className="text-[#a3b3cc] text-sm mt-2 flex items-center gap-2">
                            <LuActivity size={16} /> Track, Analyze, and Conquer your bankroll.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                            showForm
                                ? 'bg-[#2e3440] text-[#a3b3cc] hover:bg-[#3b4252]'
                                : 'bg-[#d08770] text-[#1a1d21] hover:bg-[#b06f5a] hover:shadow-[#d08770]/20 hover:-translate-y-0.5'
                        }`}
                    >
                        {showForm ? <LuCircle size={20} /> : <LuPlus size={20} />}
                        {showForm ? 'Cancel' : 'Log New Bet'}
                    </button>
                </div>

                {/* --- STATS DASHBOARD --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profit */}
                    <div className="bg-[#2e3440] p-6 rounded-2xl border border-gray-700/50 shadow-xl relative overflow-hidden group hover:border-[#d08770]/30 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 text-[#d08770] opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform group-hover:scale-110">
                            <LuDollarSign size={100} />
                        </div>
                        <div className="flex items-center gap-2 text-[#a3b3cc] mb-2 font-bold uppercase text-xs tracking-wider">
                            <LuDollarSign size={14} /> Net Profit
                        </div>
                        <div
                            className={`text-4xl font-mono font-bold tracking-tight ${
                                stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                        >
                            {stats.totalProfit > 0 ? '+' : ''}
                            {formatCurrency(stats.totalProfit)}
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="bg-[#2e3440] p-6 rounded-2xl border border-gray-700/50 shadow-xl relative overflow-hidden group hover:border-[#ebcb8b]/30 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 text-[#ebcb8b] opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform group-hover:scale-110">
                            <LuHash size={100} />
                        </div>
                        <div className="flex items-center gap-2 text-[#a3b3cc] mb-2 font-bold uppercase text-xs tracking-wider">
                            <LuActivity size={14} /> Volume
                        </div>
                        <div className="text-4xl font-mono font-bold text-[#ebcb8b]">
                            {stats.totalBets}{' '}
                            <span className="text-lg text-[#a3b3cc] font-medium">Bets</span>
                        </div>
                    </div>

                    {/* ROI */}
                    <div className="bg-[#2e3440] p-6 rounded-2xl border border-gray-700/50 shadow-xl relative overflow-hidden group hover:border-[#eceff4]/30 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 text-[#eceff4] opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform group-hover:scale-110">
                            <LuTrophy size={100} />
                        </div>
                        <div className="flex items-center gap-2 text-[#a3b3cc] mb-2 font-bold uppercase text-xs tracking-wider">
                            <LuTrendingUp size={14} /> Est. ROI
                        </div>
                        <div className="text-4xl font-mono font-bold text-[#eceff4]">
                            {stats.totalBets > 0
                                ? ((stats.totalProfit / (stats.totalBets * 100)) * 100).toFixed(1)
                                : '0.0'}
                            %
                        </div>
                    </div>
                </div>

                {/* --- ADD BET FORM --- */}
                {showForm && (
                    <div className="bg-[#2e3440] rounded-2xl p-6 md:p-8 border border-[#d08770]/30 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                        <h3 className="text-lg font-bold text-[#ebcb8b] mb-6 flex items-center gap-2 border-b border-gray-700 pb-2">
                            <LuTarget size={20} /> Wager Details
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-12 gap-6"
                        >
                            {/* Match Title */}
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-xs text-[#a3b3cc] font-bold uppercase ml-1">
                                    Matchup
                                </label>
                                <div className="relative">
                                    <LuTarget
                                        className="absolute left-3 top-3.5 text-[#a3b3cc]"
                                        size={18}
                                    />
                                    <input
                                        name="matchTitle"
                                        required
                                        placeholder="e.g. Lakers vs Warriors"
                                        onChange={handleInputChange}
                                        value={formData.matchTitle}
                                        className="w-full bg-[#1a1d21] text-white pl-10 p-3 rounded-xl border border-gray-700 focus:border-[#d08770] focus:ring-1 focus:ring-[#d08770] outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            {/* League */}
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-xs text-[#a3b3cc] font-bold uppercase ml-1">
                                    League
                                </label>
                                <div className="relative">
                                    <LuTrophy
                                        className="absolute left-3 top-3.5 text-[#a3b3cc]"
                                        size={18}
                                    />
                                    <select
                                        name="league"
                                        onChange={handleInputChange}
                                        value={formData.league}
                                        className="w-full bg-[#1a1d21] text-white pl-10 p-3 rounded-xl border border-gray-700 focus:border-[#d08770] outline-none appearance-none transition-all"
                                    >
                                        <option value="NBA">NBA</option>
                                        <option value="NFL">NFL</option>
                                    </select>
                                </div>
                            </div>

                            {/* Stake */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs text-[#a3b3cc] font-bold uppercase ml-1">
                                    Stake ($)
                                </label>
                                <div className="relative">
                                    <LuDollarSign
                                        className="absolute left-3 top-3.5 text-[#a3b3cc]"
                                        size={18}
                                    />
                                    <input
                                        name="stake"
                                        type="number"
                                        required
                                        placeholder="100"
                                        onChange={handleInputChange}
                                        value={formData.stake}
                                        className="w-full bg-[#1a1d21] text-white pl-10 p-3 rounded-xl border border-gray-700 focus:border-[#d08770] outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Odds */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs text-[#a3b3cc] font-bold uppercase ml-1">
                                    Odds
                                </label>
                                <div className="relative">
                                    <LuPercent
                                        className="absolute left-3 top-3.5 text-[#a3b3cc]"
                                        size={18}
                                    />
                                    <input
                                        name="odds"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="1.90"
                                        onChange={handleInputChange}
                                        value={formData.odds}
                                        className="w-full bg-[#1a1d21] text-white pl-10 p-3 rounded-xl border border-gray-700 focus:border-[#d08770] outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            {/* EV */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs text-[#a3b3cc] font-bold uppercase ml-1">
                                    EV % (Opt)
                                </label>
                                <div className="relative">
                                    <LuActivity
                                        className="absolute left-3 top-3.5 text-[#a3b3cc]"
                                        size={18}
                                    />
                                    <input
                                        name="evPercent"
                                        type="number"
                                        step="0.1"
                                        placeholder="5.5"
                                        onChange={handleInputChange}
                                        value={formData.evPercent}
                                        className="w-full bg-[#1a1d21] text-white pl-10 p-3 rounded-xl border border-gray-700 focus:border-[#d08770] outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-12 flex justify-end mt-4 pt-4 border-t border-gray-700/50">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-[#ebcb8b] text-[#1a1d21] font-bold py-3 px-10 rounded-xl hover:bg-[#d0b070] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                                >
                                    {submitting ? (
                                        <LuLoader size={18} className="animate-spin" />
                                    ) : (
                                        <LuCheckCheck size={18} />
                                    )}
                                    Confirm Wager
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- FILTER BAR --- */}
                <div className="flex gap-2 border-b border-[#2e3440] pb-1">
                    {['ALL', 'PENDING', 'SETTLED'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as FilterOption)}
                            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                                activeFilter === filter
                                    ? 'bg-[#2e3440] text-[#d08770] border-b-2 border-[#d08770]'
                                    : 'text-[#a3b3cc] hover:text-[#eceff4] hover:bg-[#2e3440]/50'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* --- HISTORY LIST --- */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#a3b3cc] flex items-center gap-2">
                        <LuCalendar size={20} /> History
                    </h2>

                    {filteredBets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-[#2e3440]/30 rounded-2xl border border-dashed border-gray-700 text-center">
                            <div className="bg-[#2e3440] p-4 rounded-full mb-3">
                                <LuTarget size={32} className="text-[#a3b3cc]" />
                            </div>
                            <p className="text-[#eceff4] font-medium">No bets found</p>
                            <p className="text-[#a3b3cc] text-sm mt-1">
                                Try changing the filter or placing a bet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredBets.map((bet) => (
                                <div
                                    key={bet.id}
                                    className="group bg-[#2e3440] p-5 rounded-xl flex flex-col md:flex-row justify-between items-center border border-gray-700/30 hover:border-[#d08770]/50 hover:bg-[#343b49] transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl"
                                >
                                    {/* Left: Info */}
                                    <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                    bet.league === 'NBA'
                                                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}
                                            >
                                                {bet.league}
                                            </span>
                                            <span className="text-[#a3b3cc] text-xs font-mono">
                                                {formatDate(bet.createdAt)}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-[#eceff4] tracking-tight">
                                            {bet.matchTitle}
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#a3b3cc]">
                                            <div className="flex items-center gap-1.5 bg-[#1a1d21] px-2 py-1 rounded">
                                                <LuDollarSign size={12} />{' '}
                                                <span className="text-[#eceff4] font-mono">
                                                    {formatCurrency(bet.stake)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-[#1a1d21] px-2 py-1 rounded">
                                                <LuPercent size={12} />{' '}
                                                <span className="text-[#ebcb8b] font-mono font-bold">
                                                    {bet.odds}
                                                </span>
                                            </div>
                                            {bet.evPercent && (
                                                <div className="flex items-center gap-1.5 bg-[#1a1d21] px-2 py-1 rounded">
                                                    <LuActivity size={12} />{' '}
                                                    <span className="text-green-400 font-mono">
                                                        {bet.evPercent}% EV
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Action / Result */}
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        {bet.status === 'PENDING' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSettle(bet.id, 'WON')}
                                                    className="flex items-center gap-1.5 bg-[#1a1d21] text-green-400 border border-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-500/10 hover:border-green-500/50 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <LuCheckCheck size={16} /> Won
                                                </button>
                                                <button
                                                    onClick={() => handleSettle(bet.id, 'LOST')}
                                                    className="flex items-center gap-1.5 bg-[#1a1d21] text-red-400 border border-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500/10 hover:border-red-500/50 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <LuCircle size={16} /> Lost
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-right min-w-[120px] bg-[#1a1d21] px-4 py-2 rounded-lg border border-gray-700/50">
                                                <span
                                                    className={`block font-black text-xs uppercase tracking-widest mb-1 ${
                                                        bet.status === 'WON'
                                                            ? 'text-green-400'
                                                            : bet.status === 'LOST'
                                                            ? 'text-red-400'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {bet.status}
                                                </span>
                                                <div
                                                    className={`text-xl font-mono font-bold ${
                                                        Number(bet.profit) >= 0
                                                            ? 'text-green-400'
                                                            : 'text-red-400'
                                                    }`}
                                                >
                                                    {Number(bet.profit) > 0 ? '+' : ''}
                                                    {formatCurrency(Number(bet.profit))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

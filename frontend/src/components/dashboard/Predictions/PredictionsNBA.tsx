//import { Outlet } from 'react-router-dom'; // We need to do the logic for the children routes
import { useState, useEffect } from 'react';
import { fetchNBAPredictions } from '../../../api/ServiceNBA/newPredictionServiceNBA';
import type { NBAPrediction } from '../../../types/nbaPredictionsInterface';
import { getNBALogo } from '../../../lib/NBA/nbaLogos';
import nbaLogo from '../../../assets/logos/nba.png';
import { togglePickPrediction, fetchUserPicks } from '../../../api/servicePick/picksService';
import {
    LuCalendar,
    LuTrendingUp,
    LuLoader,
    LuActivity,
    LuTrophy,
    LuSearch,
    LuFilter,
    LuChevronLeft,
    LuChevronRight,
    LuStar,
} from 'react-icons/lu';

export default function Predictions() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<NBAPrediction[]>([]);
    const [savedPicks, setSavedPicks] = useState<Set<string>>(new Set());
    const [toggling, setToggling] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showHighConfidenceOnly, setShowHighConfidenceOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 9;

    const getLogoSafe = (team: string): string | null => {
        const logo = getNBALogo(team);
        return logo ?? null;
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [predictionsResult, savedPicksResult] = await Promise.all([
                    fetchNBAPredictions(),
                    fetchUserPicks(),
                ]);

                setData(predictionsResult);
                setSavedPicks(new Set(savedPicksResult));
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Picks fetching
    const handleStarClick = async (e: React.MouseEvent, item: NBAPrediction) => {
        e.stopPropagation();
        if (toggling) return;

        setToggling(item.game_id);

        const isCurrentlySaved = savedPicks.has(item.game_id);
        const newSet = new Set(savedPicks);
        if (isCurrentlySaved) {
            newSet.delete(item.game_id);
        } else {
            newSet.add(item.game_id);
        }
        setSavedPicks(newSet);

        try {
            await togglePickPrediction(item.game_id, item);
        } catch (error) {
            console.error('Error toggling pick', error);

            if (isCurrentlySaved) newSet.add(item.game_id);
            else newSet.delete(item.game_id);
            setSavedPicks(newSet);
        } finally {
            setToggling(null);
        }
    };

    // Filtering logic
    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.team_name_home.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.team_name_away.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.predicted_winner.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesConfidence = showHighConfidenceOnly
            ? item.prob_home_win >= 70 || item.prob_home_win <= 30
            : true;

        return matchesSearch && matchesConfidence;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showHighConfidenceOnly]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getConfidenceColor = (prob: number) => {
        if (prob >= 70) return 'text-green-400';
        if (prob >= 55) return 'text-blue-400';
        return 'text-yellow-400';
    };

    const getProgressBarColor = (prob: number) => {
        if (prob >= 70) return 'from-green-500 to-emerald-400';
        if (prob >= 55) return 'from-blue-500 to-indigo-400';
        return 'from-yellow-500 to-orange-400';
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-400">
                <LuLoader className="animate-spin mr-2" size={24} />
                Loading NBA predictions...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* NBA Logo */}
                    <img
                        src={nbaLogo}
                        alt="NBA Logo"
                        className="h-18 w-auto object-contain drop-shadow-lg rounded"
                    />

                    {/* Text Group */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            NBA Predictions
                        </h1>
                        <p className="text-gray-400 text-md mt-1">
                            Statistical model powered matchup probabilities insights
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="relative flex-1">
                        <LuSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search teams (e.g., Lal, BOS)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0B0A17] border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>

                    <button
                        onClick={() => setShowHighConfidenceOnly(!showHighConfidenceOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            showHighConfidenceOnly
                                ? 'bg-green-600/20 border-green-400/60 text-green-300 shadow-md shadow-green-700/10'
                                : 'bg-[#0B0A17] border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <LuFilter size={16} />
                        {showHighConfidenceOnly ? 'High Confidence' : 'Show All'}
                    </button>
                </div>
            </div>

            <div className="text-s text-gray-500 font-mono uppercase tracking-wider">
                {filteredData.length} Games • Page {currentPage}/{totalPages}
            </div>

            {/* Predictions Grid with White Glow */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.15)] border border-white/5">
                {currentData.length === 0 ? (
                    <div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl text-gray-500 text-lg">
                        <LuSearch className="opacity-50 mb-4" size={48} />
                        No games match your filters.
                    </div>
                ) : (
                    currentData.map((item) => {
                        const homeLogo = getLogoSafe(item.team_name_home);
                        const awayLogo = getLogoSafe(item.team_name_away);
                        const winnerLogo = getLogoSafe(item.predicted_winner);
                        const isSaved = savedPicks.has(item.game_id);

                        return (
                            <div
                                key={item.game_id}
                                className="group relative flex flex-col justify-between rounded-4xl border border-white/10 bg-[#0B0A17]/80 p-8 
                                    hover:border-white/30 transition duration-500 shadow-xl
                                    hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1 cursor-pointer"
                            >
                                {/* BIG Header: Team vs Team */}
                                <div className="flex items-center justify-between mb-8">
                                    {/* HOME TEAM */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <div className="h-35 w-35 rounded-full bg-[#0B0A17] flex items-center justify-center border-2 border-white/10 p-3 mb-3 shadow-lg group-hover:border-white/30 transition">
                                            {homeLogo ? (
                                                <img
                                                    src={homeLogo}
                                                    alt={item.team_name_home}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <LuTrophy className="text-gray-600" size={28} />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-wide truncate w-full text-center">
                                            {item.team_name_home}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                            Home
                                        </span>
                                    </div>

                                    {/* STAR / VS / DATE - UPDATED SECTION */}
                                    <div className="flex flex-col items-center justify-center w-1/3 relative">
                                        <button
                                            onClick={(e) => handleStarClick(e, item)}
                                            className={`mb-3 ml-1 p-2 rounded-full transition-all duration-300 hover:bg-white/10 ${
                                                isSaved ? 'scale-110' : 'scale-100'
                                            }`}
                                            title={isSaved ? 'Remove from picks' : 'Add to picks'}
                                        >
                                            {toggling === item.game_id ? (
                                                <LuLoader
                                                    size={30}
                                                    className="animate-spin text-indigo-400"
                                                />
                                            ) : (
                                                <LuStar
                                                    size={30}
                                                    className={`transition-colors duration-300 ${
                                                        isSaved
                                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                                                            : 'fill-transparent text-gray-600 hover:text-yellow-400'
                                                    }`}
                                                />
                                            )}
                                        </button>

                                        <span className="text-4xl font-black text-white/35 italic mb-4 select-none">
                                            VS
                                        </span>
                                        <div className="flex items-center gap-2 text-[14px] font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                            <LuCalendar size={14} />
                                            {new Date(item.game_date_home).toLocaleDateString(
                                                undefined,
                                                { month: 'short', day: 'numeric' },
                                            )}
                                        </div>
                                    </div>

                                    {/* AWAY TEAM */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <div className="h-35 w-35 rounded-full bg-[#1a1825] flex items-center justify-center border-2 border-white/10 p-3 mb-3 shadow-lg group-hover:border-white/30 transition">
                                            {awayLogo ? (
                                                <img
                                                    src={awayLogo}
                                                    alt={item.team_name_away}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <LuTrophy className="text-gray-600" size={28} />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-wide truncate w-full text-center">
                                            {item.team_name_away}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                            Away
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Area */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {/* Winner Box */}
                                    <div className="p-4 rounded-2xl bg-[#1a1825]/50 border border-white/5 flex flex-col items-center justify-center text-center group-hover:bg-white/5 transition">
                                        <p className="text-[15px] text-gray-400 uppercase tracking-widest mb-2">
                                            Predicted Winner
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {winnerLogo && (
                                                <img
                                                    src={winnerLogo}
                                                    className="w-15 h-15 object-contain"
                                                    alt=""
                                                />
                                            )}
                                            <p className="text-lg text-white font-bold">
                                                {item.predicted_winner}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Probability Box */}
                                    <div className="p-4 rounded-2xl bg-[#1a1825]/50 border border-white/5 flex flex-col items-center justify-center text-center group-hover:bg-white/5 transition">
                                        <p className="text-[16px] text-gray-400 uppercase tracking-widest mb-2">
                                            Home Win Probability
                                        </p>
                                        <div
                                            className={`flex items-center gap-2 text-[28px] font-mono font-bold ${getConfidenceColor(
                                                item.prob_home_win,
                                            )}`}
                                        >
                                            <LuActivity size={25} />
                                            <p>{item.prob_home_win}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Progress Bar */}
                                <div className="border-t border-white/10 pt-5">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                                            Model Confidence
                                        </span>
                                        <span className="text-[12px] text-white font-mono font-bold">
                                            {item.prob_home_win}%
                                        </span>
                                    </div>

                                    <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden mb-3">
                                        <div
                                            className={`h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] bg-linear-to-r ${getProgressBarColor(
                                                item.prob_home_win,
                                            )}`}
                                            style={{ width: `${item.prob_home_win}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-1 text-[16px] text-gray-600">
                                        <LuTrendingUp size={16} />
                                        <span>
                                            Generated:{' '}
                                            {new Date(item.pred_timestamp_utc).toLocaleTimeString(
                                                [],
                                                { hour: '2-digit', minute: '2-digit' },
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            <LuChevronLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-12 h-12 rounded-lg text-xs font-medium transition ${
                                    currentPage === i + 1
                                        ? 'bg-indigo-600 text-white shadow shadow-indigo-800/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-40"
                        >
                            <LuChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

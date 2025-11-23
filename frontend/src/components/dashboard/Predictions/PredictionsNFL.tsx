import { useState, useEffect } from 'react';
import { Loader, TrendingUp, Activity, Trophy, Search, Calendar } from 'lucide-react';
import { fetchNFLPredictions, type NFLPrediction } from '../../../api/serviceNFL/newPredictionServiceNFL';

// Simple Logo Helper (You can expand this with real URLs later)
const getNflLogo = (team: string) => {
    // Returns ESPN CDN link for NFL teams
    // Example: "DAL" -> Dallas Cowboys logo
    return `https://a.espncdn.com/i/teamlogos/nfl/500/${team.toLowerCase()}.png`;
};

export default function PredictionsNFL() {
    const [data, setData] = useState<NFLPrediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchNFLPredictions();
            setData(result);
            setLoading(false);
        };
        loadData();
    }, []);

    // Helper for probability colors
    const getConfidenceColor = (prob: number) => {
        // prob is 0.0 - 1.0, convert to %
        const pct = prob * 100;
        if (pct >= 70) return 'text-green-400';
        if (pct >= 55) return 'text-blue-400';
        return 'text-yellow-400';
    };

    const filteredData = data.filter(
        (item) =>
            item.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.away_team.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center text-gray-400">
                <Loader className="animate-spin mr-3" size={32} />
                Loading NFL models...
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2 md:p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        NFL Predictions
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Machine learning spreads & win probabilities
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative bg-white/5 p-4 rounded-2xl border border-white/10">
                <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search NFL teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0B0A17] border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.15)] border border-white/5">
                {filteredData.map((game) => {
                    const homeWinProb = (game.prob_home_win * 100).toFixed(1);
                    const predictedWinner =
                        game.prob_home_win > 0.5 ? game.home_team : game.away_team;

                    return (
                        <div
                            key={game.game_id}
                            className="group relative flex flex-col justify-between rounded-4xl border border-white/10 bg-[#0B0A17]/80 p-8 hover:border-white/30 transition duration-500 shadow-xl hover:-translate-y-1"
                        >
                            {/* Teams Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="h-20 w-20 rounded-full bg-[#0B0A17] flex items-center justify-center border-2 border-white/10 p-3 mb-3 shadow-lg">
                                        <img
                                            src={getNflLogo(game.home_team)}
                                            alt={game.home_team}
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                                ((e.target as HTMLImageElement).style.display =
                                                    'none')
                                            }
                                        />
                                    </div>
                                    <span className="text-xl font-bold text-white">
                                        {game.home_team}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Home
                                    </span>
                                </div>

                                <div className="flex flex-col items-center justify-center w-1/3">
                                    <span className="text-2xl font-black text-white/20 italic mb-2">
                                        VS
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                        <Calendar size={10} />
                                        {new Date(game.gameday).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center w-1/3">
                                    <div className="h-20 w-20 rounded-full bg-[#1a1825] flex items-center justify-center border-2 border-white/10 p-3 mb-3 shadow-lg">
                                        <img
                                            src={getNflLogo(game.away_team)}
                                            alt={game.away_team}
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                                ((e.target as HTMLImageElement).style.display =
                                                    'none')
                                            }
                                        />
                                    </div>
                                    <span className="text-xl font-bold text-white">
                                        {game.away_team}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Away
                                    </span>
                                </div>
                            </div>

                            {/* Stats Area */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-[#1a1825]/50 border border-white/5 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                                        Spread
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={18} className="text-gray-400" />
                                        <p className="text-lg text-white font-bold">
                                            {game.spread_line}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#1a1825]/50 border border-white/5 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                                        Home Win %
                                    </p>
                                    <div
                                        className={`flex items-center gap-2 text-lg font-mono font-bold ${getConfidenceColor(
                                            game.prob_home_win,
                                        )}`}
                                    >
                                        <Activity size={18} />
                                        <p>{homeWinProb}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/10 pt-5 flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-bold uppercase">
                                    Week {game.week}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Trophy size={14} className="text-yellow-500" />
                                    <span className="text-sm text-white font-bold">
                                        Pick: {predictedWinner}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

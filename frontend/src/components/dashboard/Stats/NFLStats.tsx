import { useState, useEffect } from 'react';
import {
    fetchDetailedNFLPredictions,
    type DetailedNFLPrediction,
} from '../../../api/serviceNFL/DetailedNFLPrediction';
import { getNFLLogo } from '../../../lib/NFL/nflLogos';
import { toAbbrev } from '../../../lib/NFL/nflTeamMap';
import nflLogo from '../../../assets/logos/nfl.png';
import {
    LuLoader,
    LuCheck,
    LuX,
    LuTrendingUp,
    LuTarget,
    LuActivity,
    LuCalendar,
} from 'react-icons/lu';

export default function NFLStats() {
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState<DetailedNFLPrediction[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDetailedNFLPredictions();
                setPredictions(data);
            } catch (error) {
                console.error('Failed to load NFL stats', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter games that have actual scores (completed games)
    const completedGames = predictions.filter(
        (game) => game.home_score !== null && game.away_score !== null,
    );

    // Calculate statistics
    const calculateStats = () => {
        if (completedGames.length === 0) {
            return {
                totalGames: 0,
                correctPredictions: 0,
                accuracy: 0,
                correctSpread: 0,
                spreadAccuracy: 0,
            };
        }

        let correctPredictions = 0;
        let correctSpread = 0;

        completedGames.forEach((game) => {
            // Check if predicted winner matches actual winner
            const predictedWinner = game.predicted_home_win === 1 ? game.home_team : game.away_team;
            const actualWinner =
                (game.home_score || 0) > (game.away_score || 0) ? game.home_team : game.away_team;

            if (predictedWinner === actualWinner) {
                correctPredictions++;
            }

            // Check spread accuracy (simplified - check if predicted spread direction was correct)
            const spread = typeof game.spread_line === 'string' 
                ? parseFloat(game.spread_line) 
                : game.spread_line || 0;
            
            const actualSpread = (game.home_score || 0) - (game.away_score || 0);
            const predictedSpread = spread;

            // If both are positive or both are negative, direction is correct
            if (
                (actualSpread >= 0 && predictedSpread >= 0) ||
                (actualSpread < 0 && predictedSpread < 0)
            ) {
                correctSpread++;
            }
        });

        return {
            totalGames: completedGames.length,
            correctPredictions,
            accuracy: (correctPredictions / completedGames.length) * 100,
            correctSpread,
            spreadAccuracy: (correctSpread / completedGames.length) * 100,
        };
    };

    const stats = calculateStats();

    // Determine if prediction was correct for a game
    const isPredictionCorrect = (game: DetailedNFLPrediction): boolean => {
        const predictedWinner = game.predicted_home_win === 1 ? game.home_team : game.away_team;
        const actualWinner =
            (game.home_score || 0) > (game.away_score || 0) ? game.home_team : game.away_team;
        return predictedWinner === actualWinner;
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-400">
                <LuLoader className="animate-spin mr-2" size={24} />
                Loading NFL stats...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <img
                    src={nflLogo}
                    alt="NFL Logo"
                    className="h-18 w-auto object-contain drop-shadow-lg rounded"
                />
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        NFL Model Performance
                    </h1>
                    <p className="text-gray-400 text-md mt-1">
                        How our model performed vs actual game results
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Games */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Total Games
                        </h3>
                        <LuActivity className="text-indigo-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
                    <p className="text-xs text-gray-500 mt-2">Completed games analyzed</p>
                </div>

                {/* Win Prediction Accuracy */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Win Accuracy
                        </h3>
                        <LuTarget className="text-green-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {stats.accuracy.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {stats.correctPredictions} of {stats.totalGames} correct
                    </p>
                </div>

                {/* Spread Accuracy */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Spread Accuracy
                        </h3>
                        <LuTrendingUp className="text-blue-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {stats.spreadAccuracy.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {stats.correctSpread} of {stats.totalGames} correct
                    </p>
                </div>

                {/* Correct Predictions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Correct Picks
                        </h3>
                        <LuCheck className="text-yellow-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.correctPredictions}</p>
                    <p className="text-xs text-gray-500 mt-2">Winning team predictions</p>
                </div>
            </div>

            {/* Games List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Game Results</h2>

                {completedGames.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg">No completed games with scores available yet.</p>
                        <p className="text-sm mt-2">Check back after games are played!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {completedGames
                            .sort((a, b) => new Date(b.gameday).getTime() - new Date(a.gameday).getTime())
                            .map((game) => {
                                const homeAbbrev = toAbbrev(game.home_team);
                                const awayAbbrev = toAbbrev(game.away_team);
                                const homeLogo = getNFLLogo(homeAbbrev);
                                const awayLogo = getNFLLogo(awayAbbrev);
                                const isCorrect = isPredictionCorrect(game);
                                const predictedWinner = game.predicted_home_win === 1 
                                    ? game.home_team 
                                    : game.away_team;
                                const actualWinner = (game.home_score || 0) > (game.away_score || 0)
                                    ? game.home_team
                                    : game.away_team;

                                const probHomeWin = typeof game.prob_home_win === 'string'
                                    ? parseFloat(game.prob_home_win)
                                    : game.prob_home_win || 0;

                                return (
                                    <div
                                        key={game.game_id}
                                        className={`border rounded-xl p-4 transition ${
                                            isCorrect
                                                ? 'border-green-500/30 bg-green-500/5'
                                                : 'border-red-500/30 bg-red-500/5'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <LuCalendar size={14} />
                                                <span>
                                                    Week {game.week} •{' '}
                                                    {new Date(game.gameday).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isCorrect ? (
                                                    <>
                                                        <LuCheck className="text-green-400" size={20} />
                                                        <span className="text-green-400 text-sm font-medium">
                                                            Correct
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LuX className="text-red-400" size={20} />
                                                        <span className="text-red-400 text-sm font-medium">
                                                            Incorrect
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Away Team */}
                                            <div className="flex items-center gap-3 flex-1">
                                                {awayLogo ? (
                                                    <img
                                                        src={awayLogo}
                                                        alt={awayAbbrev}
                                                        className="h-12 w-12 object-contain"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            {awayAbbrev}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-bold">
                                                        {awayAbbrev}
                                                    </p>
                                                    <p
                                                        className={`text-2xl font-bold ${
                                                            (game.away_score || 0) >
                                                            (game.home_score || 0)
                                                                ? 'text-green-400'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {game.away_score}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* VS */}
                                            <div className="mx-4 text-gray-500 font-bold">@</div>

                                            {/* Home Team */}
                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                <div>
                                                    <p className="text-white font-bold text-right">
                                                        {homeAbbrev}
                                                    </p>
                                                    <p
                                                        className={`text-2xl font-bold text-right ${
                                                            (game.home_score || 0) >
                                                            (game.away_score || 0)
                                                                ? 'text-green-400'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {game.home_score}
                                                    </p>
                                                </div>
                                                {homeLogo ? (
                                                    <img
                                                        src={homeLogo}
                                                        alt={homeAbbrev}
                                                        className="h-12 w-12 object-contain"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            {homeAbbrev}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Prediction Info */}
                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                                            <div>
                                                <span className="text-gray-400">Predicted: </span>
                                                <span className="text-white font-medium">
                                                    {toAbbrev(predictedWinner)} (
                                                    {(probHomeWin * 100).toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Actual: </span>
                                                <span className="text-white font-medium">
                                                    {toAbbrev(actualWinner)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}


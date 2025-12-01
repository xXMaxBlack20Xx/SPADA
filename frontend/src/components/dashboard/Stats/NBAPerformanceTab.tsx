import { useMemo } from 'react';
import type { DetailedNBAPrediction } from '../../../api/ServiceNBA/DetailedNBAPrediction';
import { getNBALogo } from '../../../lib/NBA/nbaLogos';
import { toAbbrev } from '../../../lib/NBA/nbaTeamMap';
import {
    LuActivity,
    LuCalendar,
    LuCheck,
    LuGauge,
    LuTarget,
    LuTrendingUp,
    LuX,
} from 'react-icons/lu';

interface NBAPerformanceTabProps {
    predictions: DetailedNBAPrediction[];
}

const normalizeProbability = (value: number): number => {
    if (!Number.isFinite(value)) return 0;
    return value > 1 ? value / 100 : value;
};

export default function NBAPerformanceTab({ predictions }: NBAPerformanceTabProps) {
    const completedGames = useMemo(
        () => predictions.filter((game) => game.pts_home !== null && game.pts_away !== null),
        [predictions],
    );

    const stats = useMemo(() => {
        if (completedGames.length === 0) {
            return {
                totalGames: 0,
                correctPredictions: 0,
                accuracy: 0,
                avgMargin: 0,
                avgConfidence: 0,
            };
        }

        let correctPredictions = 0;
        let totalMargin = 0;
        let totalConfidence = 0;

        completedGames.forEach((game) => {
            const homeScore = Number(game.pts_home ?? 0);
            const awayScore = Number(game.pts_away ?? 0);
            const probHome = normalizeProbability(Number(game.prob_home_win ?? 0));

            const predictedWinner = toAbbrev(game.predicted_winner);
            const actualWinner = homeScore > awayScore ? game.team_name_home : game.team_name_away;

            if (predictedWinner === actualWinner) {
                correctPredictions++;
            }

            totalMargin += Math.abs(homeScore - awayScore);

            const predictedConfidence =
                predictedWinner === game.team_name_home ? probHome : 1 - probHome;
            totalConfidence += predictedConfidence;
        });

        return {
            totalGames: completedGames.length,
            correctPredictions,
            accuracy: (correctPredictions / completedGames.length) * 100,
            avgMargin: totalMargin / completedGames.length,
            avgConfidence: (totalConfidence / completedGames.length) * 100,
        };
    }, [completedGames]);

    const isPredictionCorrect = (game: DetailedNBAPrediction): boolean => {
        const homeScore = Number(game.pts_home ?? 0);
        const awayScore = Number(game.pts_away ?? 0);
        const predictedWinner = toAbbrev(game.predicted_winner);
        const actualWinner = homeScore > awayScore ? game.team_name_home : game.team_name_away;
        return predictedWinner === actualWinner;
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Win Accuracy
                        </h3>
                        <LuTarget className="text-green-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.accuracy.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {stats.correctPredictions} of {stats.totalGames} correct
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Avg Confidence
                        </h3>
                        <LuGauge className="text-blue-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.avgConfidence.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-2">Average win probability on picks</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Avg Margin
                        </h3>
                        <LuTrendingUp className="text-yellow-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.avgMargin.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-2">Average point differential per game</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
                <h2 className="text-2xl font-bold text-white mb-6">Game Results</h2>

                {completedGames.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg">No completed games with scores available yet.</p>
                        <p className="text-sm mt-2">Check back after games are played!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {completedGames
                            .sort(
                                (a, b) =>
                                    new Date(b.game_date_home).getTime() -
                                    new Date(a.game_date_home).getTime(),
                            )
                            .map((game) => {
                                const homeAbbrev = game.team_name_home;
                                const awayAbbrev = game.team_name_away;
                                const homeLogo = getNBALogo(homeAbbrev);
                                const awayLogo = getNBALogo(awayAbbrev);
                                const isCorrect = isPredictionCorrect(game);
                                const predictedWinner = toAbbrev(game.predicted_winner);
                                const actualWinner =
                                    Number(game.pts_home ?? 0) > Number(game.pts_away ?? 0)
                                        ? game.team_name_home
                                        : game.team_name_away;
                                const probHomeWin = normalizeProbability(
                                    Number(game.prob_home_win ?? 0),
                                );

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
                                                    {new Date(
                                                        game.game_date_home,
                                                    ).toLocaleDateString()}{' '}
                                                    •{' '}
                                                    {new Date(
                                                        game.game_date_home,
                                                    ).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isCorrect ? (
                                                    <>
                                                        <LuCheck
                                                            className="text-green-400"
                                                            size={20}
                                                        />
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
                                                            Number(game.pts_away ?? 0) >
                                                            Number(game.pts_home ?? 0)
                                                                ? 'text-green-400'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {game.pts_away}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mx-4 text-gray-500 font-bold">@</div>

                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                <div className="text-right">
                                                    <p className="text-white font-bold">{homeAbbrev}</p>
                                                    <p
                                                        className={`text-2xl font-bold ${
                                                            Number(game.pts_home ?? 0) >
                                                            Number(game.pts_away ?? 0)
                                                                ? 'text-green-400'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {game.pts_home}
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

                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                                            <div>
                                                <span className="text-gray-400">Predicted: </span>
                                                <span className="text-white font-medium">
                                                    {predictedWinner} (
                                                    {(
                                                        (predictedWinner === game.team_name_home
                                                            ? probHomeWin
                                                            : 1 - probHomeWin) * 100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Actual: </span>
                                                <span className="text-white font-medium">
                                                    {actualWinner}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </>
    );
}


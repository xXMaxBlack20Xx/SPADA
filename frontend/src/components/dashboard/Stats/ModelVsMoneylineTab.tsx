import { useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { DetailedNFLPrediction } from '../../../api/serviceNFL/DetailedNFLPrediction';
import { LuTrendingUp, LuDollarSign, LuTarget } from 'react-icons/lu';

interface ModelVsMoneylineTabProps {
    predictions: DetailedNFLPrediction[];
}

// Convert probability to implied moneyline odds
const probabilityToMoneyline = (prob: number): number => {
    if (prob >= 0.5) {
        // Favorite: negative odds
        return Math.round(-100 * prob / (1 - prob));
    } else {
        // Underdog: positive odds
        return Math.round(100 * (1 - prob) / prob);
    }
};

// Convert moneyline to probability
const moneylineToProbability = (moneyline: number): number => {
    if (!Number.isFinite(moneyline)) return 0;
    if (moneyline > 0) {
        return 100 / (moneyline + 100);
    } else {
        return Math.abs(moneyline) / (Math.abs(moneyline) + 100);
    }
};

export default function ModelVsMoneylineTab({
    predictions,
}: ModelVsMoneylineTabProps) {
    // Process data for charts (only include completed games)
    const chartData = useMemo(() => {
        const completedGames = predictions.filter(
            (game) => game.home_score !== null && game.away_score !== null,
        );

        return completedGames
            .map((game) => {
                const probHomeWin =
                    typeof game.prob_home_win === 'string'
                        ? parseFloat(game.prob_home_win)
                        : game.prob_home_win || 0;

                const modelMoneyline = probabilityToMoneyline(probHomeWin);

                // Use provided house moneyline/implied values from the entity when available
                const homeMl = Number.isFinite(Number(game.home_moneyline)) ? Number(game.home_moneyline) : null;
                // Prefer any explicit implied probability fields if present, otherwise compute from moneyline
                const homeImplied = Number.isFinite(Number(game.home_moneyline_implied))
                    ? Number(game.home_moneyline_implied)
                    : homeMl !== null
                        ? moneylineToProbability(homeMl)
                        : null;

                // If we have implied probabilities use them; fall back to model-based conversion if missing
                const houseProb = homeImplied !== null ? homeImplied : null;
                const houseMoneyline = homeMl !== null ? homeMl : (houseProb !== null ? probabilityToMoneyline(houseProb) : null);
                const houseProbPct = houseProb !== null ? houseProb * 100 : null;

                const modelProb = probHomeWin * 100;
                const modelProbRounded = Number(modelProb.toFixed(1));
                const houseProbRounded = houseProbPct !== null ? Number(houseProbPct.toFixed(1)) : null;

                const actualWinner =
                    (game.home_score || 0) > (game.away_score || 0) ? 'home' : 'away';
                const modelPredicted = probHomeWin >= 0.5 ? 'home' : 'away';
                const housePredicted = houseProb !== null ? (houseProb >= 0.5 ? 'home' : 'away') : null;

                const totalLine = typeof game.total_line === 'string' ? parseFloat(game.total_line) : Number(game.total_line);
                const actualTotal = (game.home_score || 0) + (game.away_score || 0);
                const overUnderResult = totalLine && !Number.isNaN(totalLine)
                    ? actualTotal > totalLine ? 'over' : actualTotal < totalLine ? 'under' : 'push'
                    : 'na';

                return {
                    gameId: game.game_id.substring(0, 8),
                    week: game.week,
                    date: new Date(game.gameday).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    modelProb: modelProbRounded,
                    houseProb: houseProbRounded,
                    modelMoneyline,
                    houseMoneyline: houseMoneyline,
                    modelCorrect: modelPredicted === actualWinner,
                    houseCorrect: housePredicted !== null ? housePredicted === actualWinner : null,
                    overUnderResult,
                    totalLine: Number.isFinite(totalLine) ? totalLine : null,
                    actualTotal,
                };
            })
            .sort((a, b) => a.week - b.week);
    }, [predictions]);

    // Aggregate data by week
    const weeklyData = useMemo(() => {
        const weeklyMap = new Map<number, { modelCorrect: number; houseCorrect: number; total: number }>();

        chartData.forEach((game) => {
            const existing = weeklyMap.get(game.week) || {
                modelCorrect: 0,
                houseCorrect: 0,
                total: 0,
            };
            existing.total++;
            if (game.modelCorrect) existing.modelCorrect++;
            if (game.houseCorrect) existing.houseCorrect++;
            weeklyMap.set(game.week, existing);
        });

        return Array.from(weeklyMap.entries())
            .map(([week, data]) => ({
                week: `Week ${week}`,
                modelAccuracy: Number(((data.modelCorrect / data.total) * 100).toFixed(1)),
                houseAccuracy: Number(((data.houseCorrect / data.total) * 100).toFixed(1)),
            }))
            .sort((a, b) => parseInt(a.week.split(' ')[1]) - parseInt(b.week.split(' ')[1]));
    }, [chartData]);

    // Probability distribution comparison
    const probabilityBins = useMemo(() => {
        const bins: Record<string, { model: number; house: number }> = {};
        const binSize = 10; // 10% bins

        chartData.forEach((game) => {
            const bin = Math.floor(game.modelProb / binSize) * binSize;
            const binKey = `${bin}-${bin + binSize}%`;
            if (!bins[binKey]) {
                bins[binKey] = { model: 0, house: 0 };
            }
            bins[binKey].model++;

            if (game.houseProb !== null) {
                const houseBin = Math.floor(game.houseProb / binSize) * binSize;
                const houseBinKey = `${houseBin}-${houseBin + binSize}%`;
                if (!bins[houseBinKey]) bins[houseBinKey] = { model: 0, house: 0 };
                bins[houseBinKey].house++;
            }
        });

        return Object.entries(bins)
            .map(([bin, counts]) => ({
                bin,
                model: counts.model,
                house: counts.house,
            }))
            .sort((a, b) => parseInt(a.bin) - parseInt(b.bin));
    }, [chartData]);

    // Over/Under totals across all completed games
    const overUnderStats = useMemo(() => {
        let over = 0;
        let under = 0;
        let push = 0;
        let na = 0;

        chartData.forEach((g) => {
            if (g.overUnderResult === 'over') over++;
            else if (g.overUnderResult === 'under') under++;
            else if (g.overUnderResult === 'push') push++;
            else na++;
        });

        const totalWithLine = over + under + push;
        const overPct = totalWithLine ? (over / totalWithLine) * 100 : 0;
        const underPct = totalWithLine ? (under / totalWithLine) * 100 : 0;
        const pushPct = totalWithLine ? (push / totalWithLine) * 100 : 0;

        return {
            over,
            under,
            push,
            na,
            totalWithLine,
            overPct: Number(overPct.toFixed(1)),
            underPct: Number(underPct.toFixed(1)),
            pushPct: Number(pushPct.toFixed(1)),
        };
    }, [chartData]);

    if (chartData.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No completed games available for comparison.</p>
                <p className="text-sm mt-2">Check back after games are played!</p>
            </div>
        );
    }

    // Calculate overall stats
    const modelCorrect = chartData.filter((g) => g.modelCorrect).length;
    const houseCorrect = chartData.filter((g) => g.houseCorrect).length;
    const totalGames = chartData.length;
    const modelAccuracy = (modelCorrect / totalGames) * 100;
    const houseAccuracy = (houseCorrect / totalGames) * 100;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Model Accuracy
                        </h3>
                        <LuTarget className="text-indigo-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{modelAccuracy.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {modelCorrect} of {totalGames} correct
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            House (real) Accuracy
                        </h3>
                        <LuDollarSign className="text-green-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{houseAccuracy.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {houseCorrect} of {totalGames} correct
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Advantage
                        </h3>
                        <LuTrendingUp className="text-yellow-400" size={24} />
                    </div>
                    <p
                        className={`text-3xl font-bold ${
                            modelAccuracy > houseAccuracy
                                ? 'text-green-400'
                                : modelAccuracy < houseAccuracy
                                  ? 'text-red-400'
                                  : 'text-white'
                        }`}
                    >
                        {(modelAccuracy - houseAccuracy).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {modelAccuracy > houseAccuracy
                            ? 'Model outperforming'
                            : modelAccuracy < houseAccuracy
                              ? 'House outperforming'
                              : 'Tied'}
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Over / Under (all completed games)
                        </h3>
                        <LuTarget className="text-indigo-400" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{overUnderStats.totalWithLine} lined</p>
                    <p className="text-xs text-gray-500 mt-2">Over: {overUnderStats.over} ({overUnderStats.overPct}%)</p>
                    <p className="text-xs text-gray-500">Under: {overUnderStats.under} ({overUnderStats.underPct}%)</p>
                    {overUnderStats.push > 0 && <p className="text-xs text-gray-500">Push: {overUnderStats.push} ({overUnderStats.pushPct}%)</p>}
                </div>
            </div>

            {/* Weekly Accuracy Comparison */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Weekly Accuracy Comparison
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="week"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            label={{
                                value: 'Accuracy %',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#9ca3af' },
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0B0A17',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="modelAccuracy"
                            stroke="#6366f1"
                            strokeWidth={3}
                            name="Model"
                            dot={{ fill: '#6366f1', r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="houseAccuracy"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="House"
                            dot={{ fill: '#10b981', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Probability Distribution */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Win Probability Distribution
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={probabilityBins}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="bin"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            label={{
                                value: 'Number of Games',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#9ca3af' },
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0B0A17',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="model" name="Model" radius={[8, 8, 0, 0]} fill="#6366f1" />
                        <Bar dataKey="house" name="House" radius={[8, 8, 0, 0]} fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Game-by-Game Comparison (ALL completed games) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Model vs House Probabilities — All Completed Games
                </h2>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            style={{ fontSize: '11px' }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            label={{
                                value: 'Win Probability %',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#9ca3af' },
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0B0A17',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="modelProb"
                            stroke="#6366f1"
                            strokeWidth={2}
                            name="Model Probability"
                            dot={{ fill: '#6366f1', r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="houseProb"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="House Probability"
                            dot={{ fill: '#10b981', r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-400 mt-4 text-center">
                    Showing all completed games. Total: {chartData.length} games
                </p>
            </div>
        </div>
    );
}

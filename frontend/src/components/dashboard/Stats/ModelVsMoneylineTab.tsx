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
    if (moneyline > 0) {
        return 100 / (moneyline + 100);
    } else {
        return Math.abs(moneyline) / (Math.abs(moneyline) + 100);
    }
};

// Generate mock moneyline odds based on model probability (for comparison)
// In a real scenario, you'd fetch actual moneyline odds from an API
const generateMockMoneyline = (modelProb: number): number => {
    // Add some variance to simulate real betting odds
    const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
    const adjustedProb = Math.max(0.05, Math.min(0.95, modelProb + variance));
    return probabilityToMoneyline(adjustedProb);
};

export default function ModelVsMoneylineTab({
    predictions,
}: ModelVsMoneylineTabProps) {
    // Process data for charts
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
                const mockMoneyline = generateMockMoneyline(probHomeWin);
                const modelProb = probHomeWin * 100;
                const mockProb = moneylineToProbability(mockMoneyline) * 100;

                const actualWinner =
                    (game.home_score || 0) > (game.away_score || 0) ? 'home' : 'away';
                const modelPredicted = probHomeWin >= 0.5 ? 'home' : 'away';

                return {
                    gameId: game.game_id.substring(0, 8),
                    week: game.week,
                    date: new Date(game.gameday).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    modelProb: Number(modelProb.toFixed(1)),
                    mockMoneylineProb: Number(mockProb.toFixed(1)),
                    modelMoneyline,
                    mockMoneyline,
                    modelCorrect: modelPredicted === actualWinner,
                    mockCorrect: (mockProb / 100 >= 0.5 ? 'home' : 'away') === actualWinner,
                };
            })
            .sort((a, b) => a.week - b.week);
    }, [predictions]);

    // Aggregate data by week
    const weeklyData = useMemo(() => {
        const weeklyMap = new Map<number, { modelCorrect: number; mockCorrect: number; total: number }>();

        chartData.forEach((game) => {
            const existing = weeklyMap.get(game.week) || {
                modelCorrect: 0,
                mockCorrect: 0,
                total: 0,
            };
            existing.total++;
            if (game.modelCorrect) existing.modelCorrect++;
            if (game.mockCorrect) existing.mockCorrect++;
            weeklyMap.set(game.week, existing);
        });

        return Array.from(weeklyMap.entries())
            .map(([week, data]) => ({
                week: `Week ${week}`,
                modelAccuracy: Number(((data.modelCorrect / data.total) * 100).toFixed(1)),
                mockAccuracy: Number(((data.mockCorrect / data.total) * 100).toFixed(1)),
            }))
            .sort((a, b) => parseInt(a.week.split(' ')[1]) - parseInt(b.week.split(' ')[1]));
    }, [chartData]);

    // Probability distribution comparison
    const probabilityBins = useMemo(() => {
        const bins: Record<string, { model: number; mock: number }> = {};
        const binSize = 10; // 10% bins

        chartData.forEach((game) => {
            const bin = Math.floor(game.modelProb / binSize) * binSize;
            const binKey = `${bin}-${bin + binSize}%`;
            if (!bins[binKey]) {
                bins[binKey] = { model: 0, mock: 0 };
            }
            bins[binKey].model++;
            const mockBin = Math.floor(game.mockMoneylineProb / binSize) * binSize;
            const mockBinKey = `${mockBin}-${mockBin + binSize}%`;
            if (!bins[mockBinKey]) {
                bins[mockBinKey] = { model: 0, mock: 0 };
            }
            bins[mockBinKey].mock++;
        });

        return Object.entries(bins)
            .map(([bin, counts]) => ({
                bin,
                model: counts.model,
                mock: counts.mock,
            }))
            .sort((a, b) => parseInt(a.bin) - parseInt(b.bin));
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
    const mockCorrect = chartData.filter((g) => g.mockCorrect).length;
    const totalGames = chartData.length;
    const modelAccuracy = (modelCorrect / totalGames) * 100;
    const mockAccuracy = (mockCorrect / totalGames) * 100;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            Moneyline Accuracy
                        </h3>
                        <LuDollarSign className="text-green-400" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-white">{mockAccuracy.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {mockCorrect} of {totalGames} correct
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
                            modelAccuracy > mockAccuracy
                                ? 'text-green-400'
                                : modelAccuracy < mockAccuracy
                                  ? 'text-red-400'
                                  : 'text-white'
                        }`}
                    >
                        {(modelAccuracy - mockAccuracy).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {modelAccuracy > mockAccuracy
                            ? 'Model outperforming'
                            : modelAccuracy < mockAccuracy
                              ? 'Moneyline outperforming'
                              : 'Tied'}
                    </p>
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
                            dataKey="mockAccuracy"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Moneyline"
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
                        <Bar dataKey="model" fill="#6366f1" name="Model" radius={[8, 8, 0, 0]} />
                        <Bar
                            dataKey="mock"
                            fill="#10b981"
                            name="Moneyline"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Game-by-Game Comparison */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Model vs Moneyline Probabilities
                </h2>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={chartData.slice(0, 20)}>
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
                            dataKey="mockMoneylineProb"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Moneyline Probability"
                            dot={{ fill: '#10b981', r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {chartData.length > 20 && (
                    <p className="text-sm text-gray-400 mt-4 text-center">
                        Showing first 20 games. Total: {chartData.length} games
                    </p>
                )}
            </div>
        </div>
    );
}


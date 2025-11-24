import { useState, useEffect } from 'react';
import {
    fetchDetailedNFLPredictions,
    type DetailedNFLPrediction,
} from '../../../api/serviceNFL/DetailedNFLPrediction';
import nflLogo from '../../../assets/logos/nfl.png';
import { LuLoader, LuActivity, LuTrendingUp } from 'react-icons/lu';
import PerformanceTab from './PerformanceTab';
import ModelVsMoneylineTab from './ModelVsMoneylineTab';

export default function NFLStats() {
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState<DetailedNFLPrediction[]>([]);
    const [activeTab, setActiveTab] = useState<'performance' | 'moneyline'>('performance');

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

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('performance')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                        activeTab === 'performance'
                            ? 'border-indigo-400 text-indigo-400'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <LuActivity size={18} />
                        Performance
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('moneyline')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                        activeTab === 'moneyline'
                            ? 'border-indigo-400 text-indigo-400'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <LuTrendingUp size={18} />
                        Model vs Moneyline
                    </div>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'performance' ? (
                <PerformanceTab predictions={predictions} />
            ) : (
                <ModelVsMoneylineTab predictions={predictions} />
            )}
        </div>
    );
}

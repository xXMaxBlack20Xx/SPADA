import { useState, useEffect } from 'react';
import { fetchPredictions, type Prediction } from '../../api/predictionServiceNBA/predictionService';
import {
    LuTrendingUp,
    LuClock,
    LuCheck,
    LuX,
    LuLoader,
} from 'react-icons/lu';

export default function Predictions() {
    const [data, setData] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchPredictions();
                setData(result);
            } catch (error) {
                console.error('Failed to load predictions', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper for Status Badge Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    // Helper for Icon based on status
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <LuCheck size={16} />;
            case 'failed':
                return <LuX size={16} />;
            default:
                return <LuClock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center text-gray-400">
                <LuLoader className="animate-spin mr-2" size={24} />
                Loading predictions...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Predicciones de Mercado</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Análisis y señales activas en tiempo real
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    + Nueva Predicción
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition duration-300"
                    >
                        {/* Top Row: Ticker & Badge */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-[#0B0A17] flex items-center justify-center border border-white/10">
                                    <span className="font-bold text-indigo-400 text-xs">
                                        {item.ticker.substring(0, 3)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">
                                        {item.title}
                                    </h3>
                                    <span className="text-xs text-gray-400">{item.ticker}</span>
                                </div>
                            </div>
                            <span
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    item.status,
                                )}`}
                            >
                                {getStatusIcon(item.status)}
                                <span className="capitalize">{item.status}</span>
                            </span>
                        </div>

                        {/* Price Data */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-[#0B0A17]/50 border border-white/5">
                                <p className="text-xs text-gray-500 mb-1">Entrada</p>
                                <p className="font-mono text-white font-medium">
                                    ${item.entryPrice.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#0B0A17]/50 border border-white/5">
                                <p className="text-xs text-gray-500 mb-1">Objetivo</p>
                                <div className="flex items-center gap-1 text-green-400">
                                    <LuTrendingUp size={14} />
                                    <p className="font-mono font-medium">
                                        ${item.targetPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer: Confidence & Date */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                    Confianza
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            style={{ width: `${item.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">
                                        {item.confidence}%
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

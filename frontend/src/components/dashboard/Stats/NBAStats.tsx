import { useEffect, useState } from 'react';
import {
    fetchDetailedNBAPredictions,
    type DetailedNBAPrediction,
} from '../../../api/ServiceNBA/DetailedNBAPrediction';
import NBAPerformanceTab from './NBAPerformanceTab';
import nbaLogo from '../../../assets/logos/nba.png';
import { LuLoader, LuActivity } from 'react-icons/lu';

export default function NBAStats() {
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState<DetailedNBAPrediction[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDetailedNBAPredictions();
                setPredictions(data);
            } catch (error) {
                console.error('Failed to load NBA stats', error);
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
                Loading NBA stats...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <img
                    src={nbaLogo}
                    alt="NBA Logo"
                    className="h-18 w-auto object-contain drop-shadow-lg rounded"
                />
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        NBA Model Performance
                    </h1>
                    <p className="text-gray-400 text-md mt-1 flex items-center gap-2">
                        <LuActivity size={16} className="text-indigo-400" />
                        Tracking how the NBA model performs vs. actual results
                    </p>
                </div>
            </div>

            <NBAPerformanceTab predictions={predictions} />
        </div>
    );
}



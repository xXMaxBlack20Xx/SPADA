import { getAccessToken } from '../auth/authApi';

const API_URL = '/api/nfl-predictions';

// Interface for the detailed prediction data
export interface DetailedNFLPrediction {
    game_id: string;
    season: number;
    week: number;
    gameday: string;
    home_team: string;
    away_team: string;
    // Scores can be null if the game hasn't been played
    home_score: number | null; 
    away_score: number | null; 
    // Lines and probabilities are often returned as strings from APIs
    spread_line: string | number; 
    total_line: string | number; 
    prob_home_win: string | number;
    predicted_home_win: number;
    pred_timestamp_utc: string;
    model_metadata?: {
        threshold: number;
        model_file: string;
        scaler_file: string;
    };
    created_at: string;
    updated_at: string;
}

// Fetch detailed NFL predictions with scores
export const fetchDetailedNFLPredictions = async (): Promise<DetailedNFLPrediction[]> => {
    const token = getAccessToken();
    try {
        const res = await fetch(API_URL, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching detailed NFL predictions:', e);
        return [];
    }
};
import { getAccessToken } from '../serviceAuth/authApi';

const API_URL = '/api/nfl-predictions';

export interface NFLPrediction {
    game_id: string;
    season: number;
    week: number;
    gameday: string;
    home_team: string;
    away_team: string;
    spread_line: number;
    prob_home_win: number;
}

export const fetchNFLPredictions = async (): Promise<NFLPrediction[]> => {
    const token = getAccessToken();
    try {
        const res = await fetch(API_URL, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

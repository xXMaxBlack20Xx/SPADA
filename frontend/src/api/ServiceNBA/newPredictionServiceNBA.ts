import type { NBAPrediction } from '../../types/nbaPredictionsInterface';
import { toAbbrev } from "../../lib/NBA/nbaTeamMap";

export const fetchNBAPredictions = async (): Promise<NBAPrediction[]> => {
    let token = localStorage.getItem('token');

    if (!token) {
        const storedTokens = localStorage.getItem('auth_tokens');
        if (storedTokens) {
            try {
                token = JSON.parse(storedTokens).accessToken;
            } catch (e) {
                console.error('Error parsing auth_tokens from localStorage:', e);
            }
        }
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    try {
        console.log('Fetching NBA predictions from:', `${API_URL}/nba-predictions`);

        const response = await fetch(`${API_URL}/nba-predictions`, {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Server Error:', text);
            throw new Error('Failed to fetch NBA predictions');
        }

        const data = await response.json();

        const predictions: NBAPrediction[] = Array.isArray(data)
            ? data.map(
                  (item: any): NBAPrediction => ({
                      game_id: String(item.game_id),
                      game_date_home: String(item.game_date_home),

                      // 🔥 Convert full name → Abbreviation
                      team_name_home: toAbbrev(item.team_name_home),
                      team_name_away: toAbbrev(item.team_name_away),
                      predicted_winner: toAbbrev(item.predicted_winner),

                      prob_home_win: Number(item.prob_home_win),
                      pred_timestamp_utc: String(item.pred_timestamp_utc),

                      model_metadata: item.model_metadata ?? {},
                      features: item.features ?? {},
                      created_at: String(item.created_at ?? ''),
                      updated_at: String(item.updated_at ?? ''),
                  }),
              )
            : [];

        return predictions;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

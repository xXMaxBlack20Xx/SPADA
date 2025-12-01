import { getAccessToken } from '../auth/authApi';
import { toAbbrev } from '../../lib/NBA/nbaTeamMap';

export interface DetailedNBAPrediction {
    game_id: string;
    game_date_home: string;
    team_name_home: string;
    team_name_away: string;
    prob_home_win: number;
    predicted_winner: string;
    pts_home: number | null;
    pts_away: number | null;
    pred_timestamp_utc: string;
    model_metadata?: Record<string, any>;
    features?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

const API_URL = '/api/nba-predictions';

export const fetchDetailedNBAPredictions = async (): Promise<DetailedNBAPrediction[]> => {
    const token = getAccessToken();

    try {
        const res = await fetch(API_URL, {
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {},
        });

        if (!res.ok) {
            console.error('Failed to fetch NBA predictions', await res.text());
            return [];
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map(
            (item: any): DetailedNBAPrediction => ({
                game_id: String(item.game_id),
                game_date_home: String(item.game_date_home),
                team_name_home: toAbbrev(item.team_name_home),
                team_name_away: toAbbrev(item.team_name_away),
                prob_home_win: Number(item.prob_home_win ?? 0),
                predicted_winner: toAbbrev(item.predicted_winner),
                pts_home:
                    item.pts_home === null || item.pts_home === undefined
                        ? null
                        : Number(item.pts_home),
                pts_away:
                    item.pts_away === null || item.pts_away === undefined
                        ? null
                        : Number(item.pts_away),
                pred_timestamp_utc: String(item.pred_timestamp_utc ?? ''),
                model_metadata: item.model_metadata ?? {},
                features: item.features ?? {},
                created_at: String(item.created_at ?? ''),
                updated_at: String(item.updated_at ?? ''),
            }),
        );
    } catch (error) {
        console.error('Error fetching NBA predictions:', error);
        return [];
    }
};



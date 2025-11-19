export interface NBAPrediction {
    game_id: string;
    game_date_home: string;
    team_name_home: string;
    team_name_away: string;
    prob_home_win: number;
    predicted_winner: string;
    pred_timestamp_utc: string;
    model_metadata?: any;
    features?: any;
    created_at?: string;
    updated_at?: string;
}

export const fetchNBAPredictions = async (): Promise<NBAPrediction[]> => {
    let token = localStorage.getItem('token');
    if (!token) {
        const storedTokens = localStorage.getItem('auth_tokens');
        if (storedTokens) token = JSON.parse(storedTokens).accessToken;
    }

    const API_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${API_URL}/nba-predictions`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch NBA predictions');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return []; // Return empty array on error so UI doesn't crash
    }
};

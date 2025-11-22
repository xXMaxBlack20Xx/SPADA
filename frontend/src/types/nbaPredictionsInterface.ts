export interface NBAPrediction {
    game_id: string;
    game_date_home: string;
    team_name_home: string;
    team_name_away: string;
    prob_home_win: number;
    predicted_winner: string;

    pred_timestamp_utc: string;

    model_metadata?: Record<string, any>;
    features?: Record<string, any>;

    created_at: string;
    updated_at: string;
}

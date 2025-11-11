export interface GameData {
    id: string;
    game_id: string;
    gameday: string;
    home_team: string;
    away_team: string;
    home_avg_pass_yards: number;
    home_avg_rush_yards: number;
    home_avg_total_yards: number;
    home_win_rate: number;
    away_avg_pass_yards: number;
    away_avg_rush_yards: number;
    away_avg_total_yards: number;
    away_win_rate: number;
    spread_line: number;
    total_line: number;
    created_at: any;
    model_metadata: {
        model_file: string;
        scaler_file: string;
        threshold: number;
        pred_home_win: number;
        pred_prob_home_win: number;
        pred_timestamp_utc: string;
        season: number;
        week: number;
    };
}

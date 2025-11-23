import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('nfl_predictions')
export class NflPrediction {
    @PrimaryColumn({ type: 'text' })
    game_id: string;

    @Column({ type: 'int' })
    season: number;

    @Column({ type: 'int' })
    week: number;

    @Column({ type: 'date' })
    gameday: string;

    @Column({ type: 'text' })
    home_team: string;

    @Column({ type: 'text' })
    away_team: string;

    @Column({ type: 'int', nullable: true })
    home_score: number;

    @Column({ type: 'int', nullable: true })
    away_score: number;

    // Numeric columns usually come back as strings in JS, so we parse them later
    @Column({ type: 'numeric', nullable: true }) 
    spread_line: number;

    @Column({ type: 'numeric', nullable: true })
    total_line: number;

    @Column({ type: 'numeric', name: 'pred_prob_home_win' }) // Mapping specific column name
    prob_home_win: number;

    @Column({ type: 'int', name: 'pred_home_win' })
    predicted_home_win: number; // 1 = Home, 0 = Away

    @Column({ type: 'timestamptz' })
    pred_timestamp_utc: Date;

    @Column({ type: 'jsonb', nullable: true })
    model_metadata: Record<string, any>;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
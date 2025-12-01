import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('nba_predictions')
export class NbaPrediction {
    @PrimaryColumn({ type: 'text' })
    game_id: string;

    @Column({ type: 'timestamptz' })
    game_date_home: Date;

    @Column({ type: 'text' })
    team_name_home: string;

    @Column({ type: 'text' })
    team_name_away: string;

    @Column({ type: 'int' })
    prob_home_win: number;

    @Column({ type: 'text' })
    predicted_winner: string;

    @Column({ type: 'timestamptz' })
    pred_timestamp_utc: Date;

    @Column({ type: 'jsonb', nullable: true })
    model_metadata: any;

    @Column({ type: 'jsonb', nullable: true })
    features: any;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // new columns 
    @Column({ type: 'int', nullable: true })
    pts_home: number | null;

    @Column({ type: 'int', nullable: true })
    pts_away: number | null;
}

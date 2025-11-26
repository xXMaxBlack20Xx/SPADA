import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BetStatus {
    PENDING = 'PENDING',
    WON = 'WON',
    LOST = 'LOST',
    PUSH = 'PUSH',
}

export enum SportLeague {
    NBA = 'NBA',
    NFL = 'NFL',
}

@Entity('user_bets')
export class UserBet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Bet
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    stake: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    odds: number;

    // Expected Value
    @Column({ name: 'ev_percent', type: 'float', nullable: true })
    evPercent: number;

    @Column({
        type: 'enum',
        enum: BetStatus,
        default: BetStatus.PENDING,
    })
    status: BetStatus;

    // Winnings or losses
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    profit: number;

    // Info game
    @Column({ name: 'match_id' })
    matchId: string;

    @Column({
        type: 'enum',
        enum: SportLeague,
    })
    league: SportLeague;

    @Column({ name: 'match_title', nullable: true })
    matchTitle: string;

    // Relationships
    @ManyToOne(() => User, (user) => user.bets)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

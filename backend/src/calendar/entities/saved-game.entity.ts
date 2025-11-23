import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('saved_games')
@Index(['userId', 'gameId'], { unique: true })
export class SavedGame {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    gameId: string; // ID from the External API (ESPN)

    @Column()
    gameDate: string; // ISO Date string (YYYY-MM-DD)

    @Column()
    matchup: string; // e.g. "Lakers vs Celtics"

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}

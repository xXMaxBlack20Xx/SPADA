import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { Pick } from '../../picks/entities/pick.entity';
import { UserBet } from 'src/binnacle/entities/user-bet.entity';

//Roles
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

//Status
export enum AccountStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    PENDING = 'pending',
}

@Entity('users')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, length: 50 })
    @Index({ unique: false })
    username?: string;

    @Column({ unique: true })
    @Index({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'text',
        nullable: true,
        select: false,
    })
    hashedRefreshToken?: string | null;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE,
    })
    status: AccountStatus;

    @Column({ nullable: true })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Pick, (pick) => pick.user, { cascade: true })
    picks: Pick[];

    @OneToMany(() => UserBet, (bet) => bet.user, { cascade: true })
    bets: UserBet[];
}

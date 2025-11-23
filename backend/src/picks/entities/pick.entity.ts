import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('picks')
export class Pick {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    pickId: string;

    @Column({ type: 'json', nullable: true })
    pickData?: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.picks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}

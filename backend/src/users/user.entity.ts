import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, OneToMany } from "typeorm";
import { Pick } from "../picks/pick.entity";

@Entity('users')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name?: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, select: false })
    hashedRefreshToken?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Pick, (pick) => pick.user, { cascade: true })
    picks: Pick[];

    // ideas
    // Estado de cuenta, rol y normalizazion
}

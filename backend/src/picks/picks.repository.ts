import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pick } from './pick.entity';

@Injectable()
export class PicksRepository {
    constructor(
        @InjectRepository(Pick)
        private readonly repository: Repository<Pick>,
    ) {}

    /**
     * Create and save a new pick
     */
    async create(userId: string, pickId: string, pickData?: Record<string, any>): Promise<Pick> {
        const pick = this.repository.create({
            userId,
            pickId,
            pickData,
        });
        return this.repository.save(pick);
    }

    /**
     * Create and save multiple picks
     */
    async createMany(
        userId: string,
        picks: Array<{ pickId: string; pickData?: Record<string, any> }>,
    ): Promise<Pick[]> {
        const pickEntities = picks.map((pick) =>
            this.repository.create({
                userId,
                pickId: pick.pickId,
                pickData: pick.pickData,
            }),
        );
        return this.repository.save(pickEntities);
    }

    /**
     * Find all picks for a user
     */
    async findByUserId(userId: string): Promise<Pick[]> {
        return this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Find a pick by ID
     */
    async findById(id: string): Promise<Pick | null> {
        return this.repository.findOne({ where: { id } });
    }

    /**
     * Find all picks with a specific pickId
     */
    async findByPickId(pickId: string): Promise<Pick[]> {
        return this.repository.find({ where: { pickId } });
    }

    /**
     * Update a pick
     */
    async update(id: string, pickData: Record<string, any>): Promise<Pick | null> {
        await this.repository.update(id, { pickData });
        return this.findById(id);
    }

    /**
     * Delete a pick
     */
    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    /**
     * Delete all picks for a user
     */
    async deleteByUserId(userId: string): Promise<number> {
        const result = await this.repository.delete({ userId });
        return result.affected ?? 0;
    }

    /**
     * Count picks for a user
     */
    async countByUserId(userId: string): Promise<number> {
        return this.repository.count({ where: { userId } });
    }
}

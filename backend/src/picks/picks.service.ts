import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pick } from './pick.entity';

@Injectable()
export class PicksService {
    constructor(
        @InjectRepository(Pick)
        private readonly picksRepository: Repository<Pick>,
    ) {}

    /**
     * Save a single pick for a user
     */
    async savePick(userId: string, pickId: string, pickData?: Record<string, any>): Promise<Pick> {
        const pick = this.picksRepository.create({
            userId,
            pickId,
            pickData,
        });
        return this.picksRepository.save(pick);
    }

    /**
     * Save multiple picks for a user at once
     */
    async saveMultiplePicks(
        userId: string,
        picks: Array<{ pickId: string; pickData?: Record<string, any> }>,
    ): Promise<Pick[]> {
        const pickEntities = picks.map((pick) =>
            this.picksRepository.create({
                userId,
                pickId: pick.pickId,
                pickData: pick.pickData,
            }),
        );
        return this.picksRepository.save(pickEntities);
    }

    /**
     * Get all picks for a user
     */
    async getUserPicks(userId: string): Promise<Pick[]> {
        return this.picksRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get a specific pick by ID
     */
    async getPickById(pickId: string): Promise<Pick | null> {
        return this.picksRepository.findOne({
            where: { id: pickId },
        });
    }

    /**
     * Get picks by pickId (useful for finding all users who made a specific pick)
     */
    async getPicksByPickId(pickId: string): Promise<Pick[]> {
        return this.picksRepository.find({
            where: { pickId },
        });
    }

    /**
     * Delete a pick
     */
    async deletePick(id: string): Promise<boolean> {
        const result = await this.picksRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    /**
     * Delete all picks for a user
     */
    async deleteUserPicks(userId: string): Promise<number> {
        const result = await this.picksRepository.delete({ userId });
        return result.affected ?? 0;
    }

    /**
     * Update pick data
     */
    async updatePick(id: string, pickData: Record<string, any>): Promise<Pick | null> {
        await this.picksRepository.update(id, { pickData });
        return this.getPickById(id);
    }

    /**
     * Count picks for a user
     */
    async countUserPicks(userId: string): Promise<number> {
        return this.picksRepository.count({ where: { userId } });
    }
}

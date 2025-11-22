import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pick } from './entities/pick.entity';

@Injectable()
export class PicksService {
    constructor(
        @InjectRepository(Pick)
        private readonly picksRepository: Repository<Pick>,
    ) {}

    /**
     * The Core Logic: Toggle a pick (Star/Unstar)
     */
    async togglePick(userId: string, gameId: string, predictionData: any) {
        // 1. Check if the pick already exists
        const existingPick = await this.picksRepository.findOne({
            where: { userId, pickId: gameId },
        });

        if (existingPick) {
            // 2. If exists -> Remove it (Unstar)
            await this.picksRepository.remove(existingPick);
            return { status: 'removed', gameId };
        } else {
            // 3. If not exists -> Create it (Star)
            const newPick = this.picksRepository.create({
                userId,
                pickId: gameId,
                pickData: predictionData,
            });
            const saved = await this.picksRepository.save(newPick);
            return { status: 'added', pick: saved };
        }
    }

    /**
     * Get all picks for the current user
     */
    async getUserPicks(userId: string): Promise<Pick[]> {
        return this.picksRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }, // Show newest picks first
        });
    }

    /**
     * Get a specific pick details
     */
    async getPickById(id: string): Promise<Pick | null> {
        return this.picksRepository.findOne({ where: { id } });
    }
}

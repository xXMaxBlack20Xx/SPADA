import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BetStatus, UserBet } from './entities/user-bet.entity';
import { Repository } from 'typeorm';
import { CreateBetDto } from './dtos/create-bet.dto';

@Injectable()
export class UserBetsService {
    constructor(
        @InjectRepository(UserBet)
        private betRepository: Repository<UserBet>,
    ) {}

    // CREATE
    async placeBet(userId: string, dto: CreateBetDto): Promise<UserBet> {
        const bet = this.betRepository.create({
            stake: dto.stake,
            odds: dto.odds,
            evPercent: dto.evPercent,
            matchId: dto.matchId,
            league: dto.league,
            matchTitle: dto.matchTitle,
            status: BetStatus.PENDING,
            profit: 0,
            user: { id: userId },
        });
        return this.betRepository.save(bet);
    }

    // Update
    async settleBet(userId: string, betId: string, status: BetStatus): Promise<UserBet> {
        const bet = await this.betRepository.findOne({
            where: { id: betId, user: { id: userId } },
        });

        if (!bet) throw new NotFoundException('Bet not found');

        bet.status = status;

        const stake = Number(bet.stake);
        const odds = Number(bet.odds);

        // Bet LOGIC
        if (status === BetStatus.WON) {
            // Profit = (Stake * Odds) - Stake
            bet.profit = stake * odds - stake;
        } else if (status === BetStatus.LOST) {
            // Profit is negative stake
            bet.profit = -stake;
        } else if (status === BetStatus.PUSH) {
            bet.profit = 0;
        } else {
            // PENDING
            bet.profit = 0;
        }
        return this.betRepository.save(bet);
    }

    // READ
    async getMyBets(userId: string) {
        return this.betRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    // STATS
    async getUserBankrollStats(userId: string) {
        const result = await this.betRepository
            .createQueryBuilder('bet')
            .where('bet.user = :userId', { userId })

            .andWhere('bet.status != :pending', { pending: BetStatus.PENDING })
            .select('SUM(bet.profit)', 'totalProfit')
            .addSelect('COUNT(bet.id)', 'totalBets')
            .getRawOne();

        return {
            totalProfit: parseFloat(result.totalProfit || 0),
            totalBets: parseInt(result.totalBets || 0),
        };
    }
}

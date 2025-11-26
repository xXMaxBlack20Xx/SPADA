import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { UserBetsService } from './user-bets.service';
import { CreateBetDto, SettleBetDto } from './dtos/create-bet.dto';

@Controller('bets')
export class UserBetsController {
    constructor(private betsService: UserBetsService) {}

    // Create
    @Post()
    createBet(@Body() dto: CreateBetDto) {
        return this.betsService.placeBet(dto.userId, dto);
    }

    // Get by ID
    @Get()
    getMyBets(@Query('userId') userId: string) {
        return this.betsService.getMyBets(userId);
    }

    // Get Stats
    @Get('stats')
    getStats(@Query('userId') userId: string) {
        return this.betsService.getUserBankrollStats(userId);
    }

    // Settle
    @Patch(':id/settle')
    settleBet(@Param('id') id: string, @Body() dto: SettleBetDto, @Body('userId') userId: string) {
        return this.betsService.settleBet(userId, id, dto.status);
    }
}

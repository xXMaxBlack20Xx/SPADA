import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PicksService } from './picks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/picks')
export class PicksController {
    constructor(private readonly picksService: PicksService) {}

    @Post('toggle')
    @UseGuards(JwtAuthGuard)
    async togglePick(@Body() body: { gameId: string; data: any }, @Req() req) {
        // req.user.userId comes from your JWT Strategy
        return this.picksService.togglePick(req.user.userId, body.gameId, body.data);
    }

    @Get('my-picks')
    @UseGuards(JwtAuthGuard)
    async getMyPicks(@Req() req) {
        return this.picksService.getUserPicks(req.user.userId);
    }
}

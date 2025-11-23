import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/calendar')
export class CalendarController {
    constructor(private readonly service: CalendarService) {}

    // 1. Proxy Route: Get games from ESPN
    // Frontend calls: /api/calendar/schedule?date=20231125
    @Get('schedule')
    async getSchedule(@Query('date') date: string) {
        return this.service.getPublicSchedule(date);
    }

    // 2. Get User's Saved Games
    @Get('my-games')
    @UseGuards(JwtAuthGuard)
    async getMyGames(@Req() req) {
        return this.service.getUserSavedGames(req.user.userId);
    }

    // 3. Toggle Save
    @Post('toggle')
    @UseGuards(JwtAuthGuard)
    async toggleGame(@Body() body: { gameId: string; date: string; matchup: string }, @Req() req) {
        return this.service.toggleSavedGame(req.user.userId, body.gameId, body.date, body.matchup);
    }
}

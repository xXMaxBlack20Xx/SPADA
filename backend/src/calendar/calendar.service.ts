import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { SavedGame } from './entities/saved-game.entity';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(SavedGame)
        private readonly repo: Repository<SavedGame>,
    ) {}

    async getPublicSchedule(dateStr: string) {
        const url = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}`;

        try {
            const response = await axios.get(url);
            const events = response.data.events || [];

            // Simplify the messy ESPN data for our frontend
            return events.map((event) => ({
                gameId: event.id,
                date: event.date, // ISO String
                shortName: event.shortName, // e.g. "LAL @ BOS"
                status: event.status.type.state, // "pre", "in", "post"
                homeTeam: event.competitions[0].competitors.find((c) => c.homeAway === 'home').team
                    .abbreviation,
                awayTeam: event.competitions[0].competitors.find((c) => c.homeAway === 'away').team
                    .abbreviation,
                homeLogo: event.competitions[0].competitors.find((c) => c.homeAway === 'home').team
                    .logo,
                awayLogo: event.competitions[0].competitors.find((c) => c.homeAway === 'away').team
                    .logo,
            }));
        } catch (error) {
            console.error('ESPN API Error', error);
            return []; // Return empty if API fails
        }
    }

    async toggleSavedGame(userId: string, gameId: string, date: string, matchup: string) {
        const existing = await this.repo.findOne({ where: { userId, gameId } });

        if (existing) {
            await this.repo.remove(existing);
            return { status: 'removed', gameId };
        } else {
            const newSave = this.repo.create({
                userId,
                gameId,
                gameDate: date,
                matchup,
            });
            await this.repo.save(newSave);
            return { status: 'saved', game: newSave };
        }
    }

    async getUserSavedGames(userId: string) {
        return this.repo.find({ where: { userId } });
    }
}

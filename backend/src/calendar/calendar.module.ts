import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedGame } from './entities/saved-game.entity';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SavedGame])],
    controllers: [CalendarController],
    providers: [CalendarService],
    exports: [CalendarService],
})
export class CalendarModule {}

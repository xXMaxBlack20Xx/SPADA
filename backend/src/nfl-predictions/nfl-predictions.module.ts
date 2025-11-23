import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NflPrediction } from './entities/nfl-prediction.entity';
import { NflPredictionsController } from './nfl-predictions.controller';
import { NflPredictionsService } from './nfl-predictions.service';

@Module({
    imports: [TypeOrmModule.forFeature([NflPrediction])],
    controllers: [NflPredictionsController],
    providers: [NflPredictionsService],
})
export class NflPredictionsModule {}

import { Module } from '@nestjs/common';
import { NbaPredictionsService } from './nba-predictions.service';
import { NbaPredictionsController } from './nba-predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NbaPrediction } from './entities/nba-prediction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NbaPrediction])],
    controllers: [NbaPredictionsController],
    providers: [NbaPredictionsService],
})
export class NbaPredictionsModule {}

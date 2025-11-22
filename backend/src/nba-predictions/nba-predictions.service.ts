import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NbaPrediction } from './entities/nba-prediction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NbaPredictionsService {
    constructor(
        @InjectRepository(NbaPrediction)
        private predictionsRepository: Repository<NbaPrediction>,
    ) {}

    async findAll() {
        return await this.predictionsRepository.find({
            order: {
                game_date_home: 'DESC',
            },
        });
    }

    async findOne(id: string) {
        return await this.predictionsRepository.findOneBy({ game_id: id });
    }
}

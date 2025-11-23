import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NflPrediction } from "./entities/nfl-prediction.entity";
import { Repository } from "typeorm";

@Injectable()
export class NflPredictionsService {
    constructor(
        @InjectRepository(NflPrediction)
        private predictionsRepository: Repository<NflPrediction>,
    ) {}

    async findAll() {
        return await this.predictionsRepository.find({
            order: { gameday: 'DESC' }
        });
    }

    async findOne(id: string) {
        return await this.predictionsRepository.findOneBy({ game_id: id });
    }
}
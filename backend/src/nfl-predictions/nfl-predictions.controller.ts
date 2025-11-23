import { Controller, Get, Param } from '@nestjs/common';
import { NflPredictionsService } from './nfl-predictions.service';

@Controller('api/nfl-predictions')
export class NflPredictionsController {
    constructor(private readonly nflPredictionsService: NflPredictionsService) {}

    @Get()
    findAll() {
        return this.nflPredictionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.nflPredictionsService.findOne(id);
    }
}

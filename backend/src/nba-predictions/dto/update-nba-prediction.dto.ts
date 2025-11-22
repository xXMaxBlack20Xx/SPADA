import { PartialType } from '@nestjs/mapped-types';
import { CreateNbaPredictionDto } from './create-nba-prediction.dto';

export class UpdateNbaPredictionDto extends PartialType(CreateNbaPredictionDto) {}

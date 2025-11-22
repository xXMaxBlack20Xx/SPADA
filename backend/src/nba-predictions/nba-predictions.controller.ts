import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NbaPredictionsService } from './nba-predictions.service';
// To Do: Yepis agregar validaciones en el back para que tambien use lo de JWT
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nba-predictions')
export class NbaPredictionsController {
  constructor(private readonly nbaPredictionsService: NbaPredictionsService) {}

  @Get()
  // @UseGuards(JwtAuthGuard) // Uncomment this if you want it protected
  findAll() {
    return this.nbaPredictionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nbaPredictionsService.findOne(id);
  }
}
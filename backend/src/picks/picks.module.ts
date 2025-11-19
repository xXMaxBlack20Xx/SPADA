import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pick } from './pick.entity';
import { PicksService } from './picks.service';
import { PicksRepository } from './picks.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Pick])],
    providers: [PicksService, PicksRepository],
    exports: [PicksService, PicksRepository],
})
export class PicksModule {}

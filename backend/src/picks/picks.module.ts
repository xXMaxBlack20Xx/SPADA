import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pick } from './entities/pick.entity';
import { PicksService } from './picks.service';
import { PicksController } from './picks.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Pick])],
    controllers: [PicksController],
    providers: [PicksService],
    exports: [PicksService],
})
export class PicksModule {}

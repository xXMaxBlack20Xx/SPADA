import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBet } from './entities/user-bet.entity';
import { UserBetsController } from './user-bets.controller';
import { UserBetsService } from './user-bets.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserBet])],
    controllers: [UserBetsController],
    providers: [UserBetsService],
    exports: [UserBetsService],
})
export class UserBetsModule {}

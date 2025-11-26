import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { SportLeague, BetStatus } from '../entities/user-bet.entity';

export class CreateBetDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @Min(1)
    stake: number;

    @IsNumber()
    @Min(1.01)
    odds: number;

    @IsNumber()
    @IsOptional()
    evPercent?: number;

    @IsString()
    @IsNotEmpty()
    matchId: string; // ID

    @IsEnum(SportLeague)
    @IsNotEmpty()
    league: SportLeague; // 'NBA' or 'NFL'

    @IsString()
    @IsOptional()
    matchTitle?: string;
}

export class SettleBetDto {
    @IsEnum(BetStatus)
    status: BetStatus;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}

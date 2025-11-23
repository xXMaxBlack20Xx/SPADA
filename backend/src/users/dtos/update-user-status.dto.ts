import { IsEnum } from 'class-validator';
import { AccountStatus } from '../entities/user.entity';

export class UpdateUserStatusDto {
    @IsEnum(AccountStatus)
    status: AccountStatus;
}

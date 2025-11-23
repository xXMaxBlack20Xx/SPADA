import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @IsString()
    @MinLength(6)
    @Matches(/^(?=(?:.*\d){2,})(?=.*[\W_]).*$/, {
        message: 'PASSWORD_WEAK',
    })
    password?: string;
}

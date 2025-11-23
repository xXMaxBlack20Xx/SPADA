import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=(?:.*\d){2,})(?=.*[\W_]).*$/, {
        message: 'PASSWORD_WEAK',
    })
    password: string;
}

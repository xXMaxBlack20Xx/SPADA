import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

type UserPayload = {
    userId: string;
    email: string;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: UserPayload) {
        return user;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    logout(@CurrentUser() user: UserPayload) {
        return this.authService.logout(user.userId);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    refreshToken(@CurrentUser() user: UserPayload, @Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(user.userId, body.refreshToken);
    }
}

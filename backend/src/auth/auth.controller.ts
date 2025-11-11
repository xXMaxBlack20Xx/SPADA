// We will create these soon
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { CurrentUser } from '../common/decorators/current-user.decorator';

import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

// Define la forma del payload para el decorador
type UserPayload = {
    userId: string;
    email: string;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED) // 201
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK) // 200
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: UserPayload) {
        console.log('User from token:', user);
        return user;
    }
    
    /*
      // We will uncomment these protected routes after we make the guards
        @Post('logout')
        @UseGuards(JwtAuthGuard) // Protects this route
        @HttpCode(HttpStatus.OK)
        logout(@CurrentUser() user: { userId: string }) {
            return this.authService.logout(user.userId);
  }

  @Post('refresh')
  // This will use a special Refresh Token Guard
  @HttpCode(HttpStatus.OK)
  refreshToken() {
    // This logic is a bit more complex, we'll add it later
    // For now, it needs a RefreshTokenGuard
  }
  */
}

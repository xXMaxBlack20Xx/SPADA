// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { AccountStatus } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // Registration
    async signup(signupDto: SignupDto) {
        const { email, password, name } = signupDto;

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.userService.create({
            email,
            password: hashedPassword,
            username: name,
        });

        const tokens = await this.issueTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    // Login
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userService.findWithPasswordByEmail(email);

        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status === AccountStatus.SUSPENDED) {
            throw new UnauthorizedException('Account suspended');
        }

        const tokens = await this.issueTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    // Logout
    async logout(userId: string) {
        return this.userService.updateRefreshToken(userId, null);
    }

    // New access token using a refresh token.
    async refreshToken(userId: string, currentRefreshToken: string) {
        const user = await this.userService.findByIdWithRefreshToken(userId);

        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        const isTokenValid = await argon2.verify(user.hashedRefreshToken, currentRefreshToken);

        if (!isTokenValid) {
            throw new UnauthorizedException('Access Denied');
        }

        const tokens = await this.issueTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    // --- PRIVATE HELPER METHODS ---

    // Helper to hash and save the refresh token.
    private async updateRefreshTokenHash(userId: string, refreshToken: string) {
        const hash = await argon2.hash(refreshToken);
        await this.userService.updateRefreshToken(userId, hash);
    }

    // Helper to generate both access and refresh tokens.
    private async issueTokens(userId: string, email: string) {
        const payload = { sub: userId, email };
        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET not found');
        }

        const [accessToken, refreshToken] = await Promise.all([
            // Access Token (short-lived)
            this.jwtService.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: '15m',
            }),
            // Refresh Token (long-lived)
            this.jwtService.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
}

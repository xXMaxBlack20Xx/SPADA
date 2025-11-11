import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    //Handles user registration.
    async signup(signupDto: SignupDto) {
        const { email, password } = signupDto;

        // 1. Check if user already exists
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // 2. Hash password
        const hashedPassword = await argon2.hash(password);

        // 3. Create and save user
        const user = await this.userService.create({
            email,
            password: hashedPassword,
        });

        // 4. Issue tokens
        const tokens = await this.issueTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    // Handles user login.
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Find user (and include password)
        const user = await this.userService.findWithPasswordByEmail(email);

        // 2. Check if user exists and password is correct
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3. Issue tokens
        const tokens = await this.issueTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    //Handles user logout (by clearing their refresh token).
    async logout(userId: string) {
        // Set refresh token to an empty sapce in the database
        return this.userService.updateRefreshToken(userId, '');
    }

    //Handles issuing a new access token using a refresh token.
    async refreshToken(userId: string, currentRefreshToken: string) {
        const user = await this.userService.findById(userId);

        // Check if user exists and has a refresh token
        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        // Check if the provided refresh token is valid
        const isTokenValid = await argon2.verify(user.hashedRefreshToken, currentRefreshToken);

        if (!isTokenValid) {
            throw new UnauthorizedException('Access Denied');
        }

        // Issue new tokens and update the hash
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

    //Helper to generate both access and refresh tokens.
    private async issueTokens(userId: string, email: string) {
        const payload = { sub: userId, email };
        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        if (jwtSecret == null) {
            throw new Error('No se encontro el secrceto');
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

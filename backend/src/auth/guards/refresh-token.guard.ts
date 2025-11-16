import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') {
    // Uses the same JWT strategy but the frontend will send the refresh token instead
}

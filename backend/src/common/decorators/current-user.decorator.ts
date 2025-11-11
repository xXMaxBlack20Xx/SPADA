import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Definimos la forma del payload que esperamos del JWT
type UserPayload = {
    userId: string;
    email: string;
};

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
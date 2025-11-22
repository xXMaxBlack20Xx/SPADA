import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            // Just DTO properties
            whitelist: true,
            forbidNonWhitelisted: true,

            // Payload -> DTO
            transform: true,
        }),
    );

    // Enablnig CORS to  allow  request  from the frontend
    // ToDO: dont leave origin as  true  once  we  go  live
    app.enableCors({
        origin: true, // allow any origin
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

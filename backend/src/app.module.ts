import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PicksModule } from './picks/picks.module';
import { NbaPredictionsModule } from './nba-predictions/nba-predictions.module';

@Module({
    imports: [
        // Loads .env and makes ConfigService available everywhere
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['../.env'],
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('POSTGRES_HOST'),
                port: Number(config.get<string>('POSTGRES_PORT')),
                username: config.get<string>('POSTGRES_USER'),
                password: config.get<string>('POSTGRES_PASSWORD'),
                database: config.get<string>('POSTGRES_DB'),

                autoLoadEntities: true,
                synchronize: false, // Se agregara esto por mientras por que no tengo el derecho de super usuario en render
                // synchronize: process.env.NODE_ENV !== 'production',

                ssl: {
                    rejectUnauthorized: false, // Render needs this
                },
            }),
        }),

        UserModule,
        AuthModule,
        PicksModule,
        NbaPredictionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

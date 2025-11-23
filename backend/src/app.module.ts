import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PicksModule } from './picks/picks.module';
import { NbaPredictionsModule } from './nba-predictions/nba-predictions.module';
import { CalendarModule } from './calendar/calendar.module';
import { NflPredictionsModule } from './nfl-predictions/nfl-predictions.module';

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
                
                // Cuando se tiene la app en produccion, no se debe usar synchronize: true
                synchronize: false,

                // Ejecuta las migraciones automaticamente al iniciar la app
                // Que es util para entornos como Render donde no se tiene acceso
                migrationsRun: true,

                ssl: {
                    rejectUnauthorized: false, // Render needs this
                },
            }),
        }),

        UserModule,
        AuthModule,
        PicksModule,
        CalendarModule,
        NbaPredictionsModule,
        NflPredictionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

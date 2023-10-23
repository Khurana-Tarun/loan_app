import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import { LoanModule } from './loan/loan.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { WinstonModule } from 'nest-winston';
import { PostgresModule } from './postgres/postgres.module';
import * as winston from 'winston';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      envFilePath: `.env`,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: (await redisStore({
          url: configService.get('redis.url'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.prettyPrint(),
          ),
        }),
      ],
      level: 'debug',
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          isGlobal: true,
          envFilePath: `.env`,
        }),
      ],
      useFactory: (configservice: ConfigService) => ({
        type: 'postgres',
        host: configservice.get('POSTGRES_HOST'),
        port: +configservice.get<number>('POSTGRES_PORT'),
        database: configservice.get('POSTGRES_DATABASE'),
        username: configservice.get('POSTGRES_USER'),
        password: configservice.get('POSTGRES_PASSWORD'),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/src/shared/migrations/**/*.js'],
        migrationsRun: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    LoanModule,
    AdminModule,
    UserModule,
    PostgresModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminService],
})
export class AppModule {}

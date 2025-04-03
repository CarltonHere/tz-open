import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { BalanceModule } from '../balance/balance.module';
import { TransformInterceptor } from '../transform/transform.interceptor';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { BullModule } from '@nestjs/bullmq';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Config } from 'cache-manager';
import { redisInsStore } from 'cache-manager-redis-yet';
import { MurLockModule } from 'murlock';
import { join } from 'path';
import { RedisClientType, createClient } from 'redis';
import { ApiKeyModule } from '../api-key/api-key.module';
import { AuthGuard } from '../auth/auth.guard';
import { PrimaryExceptionFilter } from '../exception/exception.filter';
import { OpenModule } from '../open/open.module';
import { PermissionGuard } from '../permission/permission.guard';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 这里指定你的静态文件夹路径
      serveRoot: '/public',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        type: 'mysql',
        autoLoadEntities: true,
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        logging: configService.getOrThrow('ENVIRONMENT') === 'development',
        // synchronize: configService.getOrThrow('ENVIRONMENT') === 'development',
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options = {
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        };
        const redisCache = createClient(options);
        redisCache.on('error', (err) => {
          const logger = new Logger(CacheModule.name);
          logger.error('CacheModule Redis Client Error', err);
        });
        await redisCache.connect();
        return {
          store: redisInsStore(
            redisCache as RedisClientType,
            options as Config,
          ) as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
    MurLockModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redisOptions: {
          socket: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
          },
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        },
        wait: configService.get('MURLOCK_WAIT'),
        maxAttempts: configService.get('MURLOCK_MAX_ATTEMPTS'),
        logLevel: configService.get('MURLOCK_LOG_LEVEL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ApiModule,
    BalanceModule,
    OpenModule,
    RoleModule,
    PermissionModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrimaryExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JSON_WEB_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JSON_WEB_TOKEN_EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    UsersModule,
    ApiKeysModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

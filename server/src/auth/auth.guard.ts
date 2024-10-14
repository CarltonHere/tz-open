import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    @Inject(ApiKeyService)
    private readonly apiKeyService: ApiKeyService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const requestHeader = this.parseHeader(request);
    if (!requestHeader.token) {
      throw new UnauthorizedException();
    }
    let payload = null;
    // 判断token类型
    if (requestHeader.token.type === 'API_KEY') {
      const canUseApiKey = this.reflector.getAllAndOverride('canUseApiKey', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!canUseApiKey) {
        this.logger.error(
          `Error occurred: This endpoint does not allow API_KEY token type.`,
        );
        throw new UnauthorizedException();
      }
      try {
        [request['API_KEY_ID'], payload] = await this.verifyApiKey(
          requestHeader?.token?.value,
        );
        this.logger.verbose(payload);
      } catch (exception) {
        this.logger.error(
          `Error occurred: ${exception.message}`,
          exception.stack,
        );
        throw new UnauthorizedException();
      }
    } else if (requestHeader.token.type === 'Bearer') {
      try {
        const user_jwt = await this.jwtService.verifyAsync(
          requestHeader?.token?.value,
          {
            secret: this.configService.get<string>('JSON_WEB_TOKEN_SECRET'),
          },
        );
        this.logger.verbose(user_jwt);

        // 获取查找用户
        payload = await this.userService.findOne(user_jwt.id);
        console.log(payload);
      } catch (exception) {
        this.logger.error(
          `Error occurred: ${exception.message}`,
          exception.stack,
        );
        throw new UnauthorizedException();
      }
    } else {
      this.logger.error(
        `Error occurred: Unknown token type: ${requestHeader.token.type}`,
      );
      throw new UnauthorizedException();
    }

    if (!payload?.id) {
      this.logger.error(
        `Error occurred: Invalid token: ${requestHeader.token.value}`,
      );
      throw new UnauthorizedException();
    }

    request['user'] = {
      id: payload?.id,
      role: payload?.role?.id,
      // username: payload.username,
      // ip: requestHeader.ip,
    };

    return true;
  }

  private parseHeader(request: Request) {
    const token = {
      type: '',
      value: '',
    };
    console.log(request.headers);
    if (request?.headers?.authorization) {
      if (request?.headers?.authorization?.includes('Bearer')) {
        [token.type, token.value] =
          request.headers.authorization?.split(' ') ?? [];
      }
      if (
        request?.headers?.authorization?.toLowerCase?.().includes?.('tzopen')
      ) {
        token.type = 'API_KEY';
        token.value = request.headers.authorization
          .toLowerCase()
          .split('tzopen-')[1];
      }
    }
    const ip = request.headers['x-real-ip'] ?? request.ip;
    return {
      ip,
      token: token?.value ? token : undefined,
    };
  }

  private async verifyApiKey(rawToken: string) {
    const userCache: undefined | { id: number; user: User } =
      await this.cacheManager.get(rawToken);
    if (userCache?.id && userCache?.user) {
      console.log('token cache hit');
      return [userCache.id, userCache.user];
    }
    const apiKeyItem = await this.apiKeyService.findOne({ uuid: rawToken });
    console.log(apiKeyItem);
    if (!apiKeyItem) {
      this.logger.error(`Error occurred: Invalid API_KEY token: ${rawToken}`);
      throw new UnauthorizedException();
    }
    await this.cacheManager.set(
      apiKeyItem.uuid,
      { id: apiKeyItem.id, user: apiKeyItem.user },
      60 * 60 * 1000,
    );
    return [apiKeyItem.id, apiKeyItem.user];
  }
}

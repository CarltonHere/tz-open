import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ApiKeysService } from 'src/api-keys/api-keys.service';
import { ApiKey } from 'src/api-keys/entities/api-key.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export enum TokenType {
  BEARER = 'Bearer',
  APIKEY = 'Apikey',
  GUEST = 'Guest',
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly apiKeysService: ApiKeysService,
    private readonly permissionsService: PermissionsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const requestHeaderPayload = this.parseHeader(request);
    if (requestHeaderPayload?.token?.type === TokenType.BEARER) {
      const user = await this.verfiyBearerToken(requestHeaderPayload.token);
      request['permission'] = await this.verfiyPermission(request, user);
      request['user'] = user;
    } else if (requestHeaderPayload?.token?.type === TokenType.APIKEY) {
      const user = await this.verfiyApikeyToken(requestHeaderPayload.token);
      request['permission'] = await this.verfiyPermission(request, user);
      request['user'] = user;
    } else if (requestHeaderPayload?.token?.type === TokenType.GUEST) {
      request['permission'] = await this.verfiyPermission(request, null);
      request['user'] = {
        id: 'guest',
        username: 'guest',
      } as User;
    }

    return true;
  }

  private async verfiyBearerToken(token: { type: TokenType; value: string }) {
    try {
      const user_jwt: {
        id: string;
        username: string;
      } = await this.jwtService.verifyAsync(token?.value, {
        secret: this.configService.get<string>('JSON_WEB_TOKEN_SECRET'),
      });
      this.logger.verbose(user_jwt);
      let user: User | null;
      user = await this.cacheManager.get(`user-${user_jwt.id}`);
      console.log('cacheUser', user);
      // 尝试从数据库获取查找用户
      if (!user) {
        user = await this.usersService.findOne(user_jwt.id);
      }
      // 最终判断
      if (!user) {
        this.logger.error(`Error occurred: User ${user_jwt.id} not found`);
        throw new UnauthorizedException();
      }
      await this.cacheManager.set(`user-${user_jwt.id}`, user, 1000 * 60);
      console.log(user);
      return user;
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
      if ((exception as Error)?.name === 'TokenExpiredError') {
        throw new HttpException('JwtExpired', HttpStatus.UNAUTHORIZED);
      }
      throw new UnauthorizedException();
    }
  }

  private async verfiyApikeyToken(token: { type: TokenType; value: string }) {
    try {
      let apiKey: ApiKey | null;
      apiKey = await this.cacheManager.get(`apiKey-${token.value}`);
      // 尝试从数据库获取查找用户
      if (!apiKey || !apiKey.owner) {
        apiKey = await this.apiKeysService.findOne(token.value, {
          relations: ['owner'],
        });
      }
      // 最终判断
      if (!apiKey || !apiKey.owner) {
        this.logger.error(`Error occurred: ${token.value} not found`);
        throw new UnauthorizedException();
      }
      // 每个apiKey缓存1分钟
      await this.cacheManager.set(`apiKey-${token.value}`, apiKey, 1000 * 60);
      console.log(apiKey.owner);
      return apiKey.owner;
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
      throw new UnauthorizedException();
    }
  }

  private parseHeader(request: FastifyRequest) {
    console.log(request.headers);
    const ip = request.headers['x-real-ip'] ?? request.ip;
    if (request?.headers?.authorization) {
      if (
        request?.headers?.authorization?.toLowerCase?.().includes?.('tzopen')
      ) {
        return {
          ip,
          token: {
            type: TokenType.APIKEY,
            value: request.headers.authorization
              .toLowerCase()
              .split('tzopen-')[1],
          },
        };
      }

      if (request?.headers?.authorization?.includes('Bearer')) {
        return {
          ip,
          token: {
            type: TokenType.BEARER,
            value: request.headers.authorization?.split?.(' ')?.[1],
          },
        };
      }
    }
    // 没有token 回落游客
    return {
      ip,
      token: {
        type: TokenType.GUEST,
        value: '',
      },
    };
  }

  private async verfiyPermission(request: FastifyRequest, user: User | null) {
    let permission: Permission | null;
    const cacheKey = `permission-${user ? `userId${user?.role?.id}` : 'Public'}-${request.method}-${request?.routeOptions.url}`;
    permission = await this.cacheManager.get(cacheKey);
    console.log('permissionCache', permission);
    // 尝试从数据库获取查找权限
    if (!permission) {
      permission = await this.permissionsService.findOne({
        role: user
          ? {
              id: user?.role?.id,
            }
          : {
              name: 'Public',
            },
        path: request?.routeOptions.url,
        method: request.method,
      });
    }

    // 设置缓存
    await this.cacheManager.set(cacheKey, permission, 1000 * 60);

    if (!permission && user?.username !== 'admin') {
      this.logger.verbose(
        `用户 ${user?.id ?? user?.username ?? 'Guest'} 没有 ${request.method} 接口 ${
          request?.routeOptions.url
        } 权限`,
      );
      // 如果是访客返回401，其他用户组返回403
      if (!user) {
        throw new UnauthorizedException();
      }
      throw new ForbiddenException();
    }
    return permission;
  }
}

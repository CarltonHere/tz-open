import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
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
    private readonly permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requestHeaderPayload = this.parseHeader(request);

    if (requestHeaderPayload?.token?.type === TokenType.BEARER) {
      const user = await this.verfiyBearerToken(requestHeaderPayload.token);
      await this.verfiyPermission(request, user);

      request['user'] = user;
    } else if (requestHeaderPayload?.token?.type === TokenType.APIKEY) {
      const user = await this.verfiyApikeyToken(requestHeaderPayload.token);
      request['user'] = user;
    } else if (requestHeaderPayload?.token?.type === TokenType.GUEST) {
      await this.verfiyPermission(request, null);
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

      // 获取查找用户
      const user = await this.usersService.findOne(user_jwt.id);
      console.log(user);
      return user;
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
      throw new UnauthorizedException();
    }
  }

  private async verfiyApikeyToken(token: { type: TokenType; value: string }) {
    try {
      const user_jwt: {
        id: string;
        username: string;
      } = await this.jwtService.verifyAsync(token?.value, {
        secret: this.configService.get<string>('JSON_WEB_TOKEN_SECRET'),
      });
      this.logger.verbose(user_jwt);

      // 获取查找用户
      const user = await this.usersService.findOne(user_jwt.id);
      console.log(user);
      return user;
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
      throw new UnauthorizedException();
    }
  }

  private parseHeader(request: Request) {
    console.log(request.headers);
    const ip = request.headers['x-real-ip'] ?? request.ip;
    if (request?.headers?.authorization) {
      if (request?.headers?.authorization?.includes('Bearer')) {
        return {
          ip,
          token: {
            type: TokenType.BEARER,
            value: request.headers.authorization?.split?.(' ')?.[1],
          },
        };
      }
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
    } else {
      // 没有token 回落游客
      return {
        ip,
        token: {
          type: TokenType.GUEST,
          value: '',
        },
      };
    }
  }

  private async verfiyPermission(request: Request, user: User | null) {
    const permission = await this.permissionsService.findOne({
      role: user
        ? {
            id: user?.role?.id,
          }
        : {
            name: 'Public',
          },
      path: (
        request?.route as {
          path: string;
        }
      )?.path,
      method: request.method,
    });
    if (!permission && user?.username !== 'admin') {
      this.logger.verbose(
        `用户 ${user?.id ?? user?.username} 没有 ${request.method} 接口 ${
          (
            request as unknown as {
              _parsedUrl: {
                pathname: string;
              };
            }
          )?._parsedUrl?.pathname
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

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PermissionService } from './permission.service';
import { APP_CONST } from 'src/app/constant/app.constant';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    @Inject(PermissionService)
    private readonly permissionService: PermissionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 获取用户id
    if (!request?.user?.id && !request?.user?.role) {
      this.logger.verbose(`用户信息传递丢失`);
      throw new UnauthorizedException();
    }

    let permissions;
    const cacheKey = `role:${request.user.role.id}|permissions`;

    if (request.user.id) {
      permissions = await this.cacheManager.get(cacheKey);
      console.log('cache', permissions);
    }
    if (!permissions) {
      permissions = await this.permissionService.findAllByRole([
        {
          id: request.user.role,
        },
      ]);
      await this.cacheManager.set(cacheKey, permissions, 60 * 60 * 1000);
    }

    let flag = false;
    for (const i in permissions) {
      const verify_method =
        String(APP_CONST.method_types[permissions[i].method]).toLowerCase() ===
        String(request.method).toLowerCase();
      const verify_path = this.verifyPath(
        permissions[i].path,
        request._parsedUrl.pathname,
      );
      if (verify_method && verify_path) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      this.logger.verbose(
        `用户 ${request.user.id} 没有 ${request.method} 接口 ${request._parsedUrl.pathname} 权限`,
      );
      throw new ForbiddenException();
    }
    this.logger.verbose(
      `${request.method} 接口 ${request._parsedUrl.pathname} 鉴权成功`,
    );
    return true;
  }
  private verifyPath(permissionPath: string, currentPath: string) {
    const pattern = permissionPath;
    const stringToValidate = currentPath;
    // 将通配符 * 转换为正则表达式中的 .*
    const regexPattern = pattern.replace('*', '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    const isMatch = regex.test(stringToValidate);
    return isMatch;
  }
}

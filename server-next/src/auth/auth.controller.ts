/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token-dto';

import { nanoid } from 'nanoid';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private configService: ConfigService,
  ) {}

  @Post()
  async login(
    @Body() { username, password }: CreateAuthDto,
    @Req() request: Request,
  ) {
    const ip = String(request.headers['x-real-ip'] ?? request.ip);
    const user = await this.usersService.findOne({
      username,
      password,
    });
    if (!user) {
      // this.authService.createAuthLog({
      //   type: 'login',
      //   method: 'sso',
      //   ip,
      //   username,
      //   password,
      //   status: '3',
      // });
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }
    // this.authService.createAuthLog({
    //   type: 'login',
    //   method: 'sso',
    //   ip,
    //   username,
    //   password,
    //   user,
    // });
    this.logger.log({ ...user, ip });
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        // 认证唯一标识
        jti: nanoid(10),
      }),
      refresh_token: this.jwtService.sign(
        {
          id: user.id,
          // 认证唯一标识
          jti: nanoid(10),
        },
        {
          secret: this.configService.get<string>(
            'JSON_WEB_TOKEN_REFRESH_SECRET',
          ),
          expiresIn: this.configService.get<string>(
            'JSON_WEB_TOKEN_REFRESH_EXPIRES_IN',
          ),
        },
      ),
    };
  }

  @Post('sso')
  async loginBySso(
    @Body() { username, password }: CreateAuthDto,
    @Req() request: Request,
  ) {
    const ip = String(request.headers['x-real-ip'] ?? request.ip);
    try {
      const res = await this.httpService.axiosRef.request({
        method: 'POST',
        url: 'https://sso.tzcpa.com/adfs/oauth2/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          client_id: '3f3f58fd-0aa2-4fdb-868b-745bdaeb537a',
          client_secret: '_jZ6abJjV6KBSmtVI2sWpycsj8ZIDqv2GziKu_z6',
          scope: 'profile email openid',
          grant_type: 'password',
          username,
          password,
        },
      });
      console.log(res.data);
      if (typeof res?.data === 'object' && res?.data?.id_token) {
        const { id_token } = res.data as { id_token: string };
        const user_info = JSON.parse(
          Buffer.from(id_token.split('.')[1], 'base64').toString(),
        ) as {
          unique_name: string;
          upn: string;
          email: string;
        };
        this.logger.log({ ...user_info, ip });
        // 判断是否已经注册过，如果没有注册则注册
        let user = await this.usersService.findOne({
          username,
        });
        if (!user?.id) {
          // 获取角色
          const role = await this.rolesService.findOne({
            name: '普通用户',
          });
          if (!role) {
            throw new HttpException(
              '系统角色不存在',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
          const _user = new User();
          _user.username = username.toUpperCase();
          _user.password = password;
          _user.email = user_info['email'];
          _user.name = user_info['unique_name'];
          _user.role = role;
          user = await this.usersService.create(_user);
        } else {
          // 更新user所有信息
          user.username = username.toUpperCase();
          user.password = password;
          user.email = user_info['email'];
          user.name = user_info['unique_name'];
          await this.usersService.update(user.id, user);
        }
        return {
          username,
          access_token: this.jwtService.sign(
            {
              id: user.id,
              // 认证唯一标识
              jti: nanoid(10),
            },
            {
              expiresIn: this.configService.get<string>(
                'JSON_WEB_TOKEN_EXPIRES_IN',
              ),
            },
          ),
          refresh_token: this.jwtService.sign(
            {
              id: user.id,
              // 认证唯一标识
              jti: nanoid(10),
            },
            {
              secret: this.configService.get<string>(
                'JSON_WEB_TOKEN_REFRESH_SECRET',
              ),
              expiresIn: this.configService.get<string>(
                'JSON_WEB_TOKEN_REFRESH_EXPIRES_IN',
              ),
            },
          ),
        };
      } else {
        throw new HttpException(
          'SSO认证服务器发生错误',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (exception: any) {
      this.logger.error(
        `Error occurred: ${exception.message}`,
        exception.stack,
      );
      if (!exception.response?.status) {
        throw exception;
      }
      if (exception.response?.status === 400) {
        throw new HttpException(
          'SSO服务用户名或密码错误',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (exception.response?.data?.error_description) {
        throw new HttpException(
          exception.response?.data?.error_description as string,
          exception?.response?.status as number,
        );
      }
      throw new HttpException(
        exception.response.data as string,
        exception?.response?.status as number,
      );
    }
  }

  @Post('refresh')
  async refreshAccessToken(@Body() { refresh_token }: RefreshAccessTokenDto) {
    try {
      const user_jwt: {
        id: string;
        username: string;
      } = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JSON_WEB_TOKEN_REFRESH_SECRET'),
      });

      this.logger.verbose(user_jwt);
      // 尝试从数据库获取查找用户
      const user = await this.usersService.findOne(user_jwt.id);
      // 最终判断
      if (!user) {
        this.logger.error(`Error occurred: User ${user_jwt.id} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        access_token: this.jwtService.sign({
          id: user.id,
          // 认证唯一标识
          jti: nanoid(10),
        }),
      };
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
      if ((exception as Error)?.name === 'TokenExpiredError') {
        throw new HttpException('JwtExpired', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('JwtInvalid', HttpStatus.FORBIDDEN);
    }
  }
}

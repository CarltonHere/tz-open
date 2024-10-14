import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  SetMetadata,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginByPasswordDto } from './dto/login-by-password.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/user.decorator';
import { GetAuthDto } from './dto/get-auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}
  @Get()
  findAll(@GetUser() user: User, @Query() query: GetAuthDto) {
    return this.authService.findAll(user, query);
  }
  @Post('login')
  @SetMetadata('isPublic', true)
  async login(
    @Body() { username, password }: LoginByPasswordDto,
    @Req() request: Request,
  ) {
    const ip = String(request.headers['x-real-ip'] ?? request.ip);
    const user = await this.userService.login(username, password);
    if (!user) {
      this.authService.createAuthLog({
        type: 'login',
        method: 'sso',
        ip,
        username,
        password,
        status: '3',
      });
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }
    this.authService.createAuthLog({
      type: 'login',
      method: 'sso',
      ip,
      username,
      password,
      user,
    });
    return {
      data: {
        access_token: this.jwtService.sign({
          id: user.id,
        }),
      },
    };
  }

  @Post('sso')
  @SetMetadata('isPublic', true)
  async loginBySso(
    @Body() { username, password }: LoginByPasswordDto,
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
          grant_type: 'password',
          username,
          password,
        },
      });
      console.log(res.data);
      if (typeof res.data === 'object' && res.data.id_token) {
        const { id_token } = res.data;
        const user_info = JSON.parse(
          Buffer.from(id_token.split('.')[1], 'base64').toString(),
        );
        this.logger.log({ ...user_info, ip });
        // 判断是否已经注册过，如果没有注册则注册
        let user = await this.userService.findOneByUsername(username);
        if (!user) {
          user = await this.userService.create({
            username,
            password,
            email: user_info['upn'],
            name: user_info['unique_name'],
          });
          this.authService.createAuthLog({
            type: 'register',
            method: 'sso',
            ip,
            username,
            password,
            user,
          });
        } else {
          this.authService.createAuthLog({
            type: 'login',
            method: 'sso',
            ip,
            username,
            password,
            user,
          });
        }
        return {
          data: {
            username,
            // email: user_info['upn'],
            // nickname: user_info['unique_name'],
            access_token: this.jwtService.sign({
              id: user.id,
            }),
          },
        };
      } else {
        this.authService.createAuthLog({
          type: 'login',
          method: 'sso',
          ip,
          username,
          password,
          status: '4',
        });
        throw new HttpException(
          'SSO认证服务器发生错误',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (exception) {
      this.logger.error(
        `Error occurred: ${exception.message}`,
        exception.stack,
      );
      if (!exception.response?.status) {
        this.authService.createAuthLog({
          type: 'login',
          method: 'sso',
          ip,
          username,
          password,
          status: '4',
        });
        throw new HttpException(
          '无法连接SSO认证服务器',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (exception.response?.status === 400) {
        this.authService.createAuthLog({
          type: 'login',
          method: 'sso',
          ip,
          username,
          password,
          status: '3',
        });
        throw new HttpException(
          'SSO服务用户名或密码错误',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (exception.response?.data?.error_description) {
        this.authService.createAuthLog({
          type: 'login',
          method: 'sso',
          ip,
          username,
          password,
          status: '4',
        });
        throw new HttpException(
          exception.response?.data?.error_description,
          exception.response.status,
        );
      }
      throw new HttpException(
        exception.response.data,
        exception.response.status,
      );
    }
  }
}

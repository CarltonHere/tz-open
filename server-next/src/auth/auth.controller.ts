/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Post('login')
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
        };
        this.logger.log({ ...user_info, ip });
        // 判断是否已经注册过，如果没有注册则注册
        let user = await this.usersService.findOne({
          username,
        });
        if (!user) {
          user = await this.usersService.create({
            username,
            password,
            email: user_info['upn'],
            name: user_info['unique_name'],
          });
          // this.authService.createAuthLog({
          //   type: 'register',
          //   method: 'sso',
          //   ip,
          //   username,
          //   password,
          //   user,
          // });
        } else {
          // this.authService.createAuthLog({
          //   type: 'login',
          //   method: 'sso',
          //   ip,
          //   username,
          //   password,
          //   user,
          // });
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
        // this.authService.createAuthLog({
        //   type: 'login',
        //   method: 'sso',
        //   ip,
        //   username,
        //   password,
        //   status: '4',
        // });
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
        // this.authService.createAuthLog({
        //   type: 'login',
        //   method: 'sso',
        //   ip,
        //   username,
        //   password,
        //   status: '4',
        // });
        throw new HttpException(
          '无法连接SSO认证服务器',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (exception.response?.status === 400) {
        // this.authService.createAuthLog({
        //   type: 'login',
        //   method: 'sso',
        //   ip,
        //   username,
        //   password,
        //   status: '3',
        // });
        throw new HttpException(
          'SSO服务用户名或密码错误',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (exception.response?.data?.error_description) {
        // this.authService.createAuthLog({
        //   type: 'login',
        //   method: 'sso',
        //   ip,
        //   username,
        //   password,
        //   status: '4',
        // });
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
}

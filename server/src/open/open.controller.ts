import {
  All,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Query,
  Req,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { OpenService } from './open.service';
// import { API } from 'src/api/api.constant';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { ApiService } from 'src/api/api.service';
import { GetUser } from 'src/user/user.decorator';
import { GetOpenDto } from './dto/get-auth.dto';

@ApiBearerAuth()
@Controller(['open', 'origin'])
export class OpenController {
  private readonly logger = new Logger(OpenController.name);

  constructor(
    private readonly openService: OpenService,
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  findAll(@GetUser() user: User, @Query() query: GetOpenDto) {
    return this.openService.findAll(user, query);
  }

  @All(':apiName/:apiUrl*')
  @ApiParam({ name: 'apiName', example: 'tyc' })
  @ApiParam({
    name: 'apiUrl',
    description: '远程接口路径',
  })
  @SetMetadata('canUseApiKey', true)
  async proxy(
    @Req() request: Request & { _parsedUrl: { pathname: string } },
    @Res() res: Response, // 获取 Express 的响应对象
    // @GetUser() user: UserType,
  ) {
    const api: any = await this.apiService.findOne(request.params.apiName, [
      'id',
      'uuid',
      'name',
      'symbol',
      'base_url',
      'access_token',
      'price',
      'priceType',
      'version',
      'status',
      'create_time',
      'update_time',
    ]);

    if (!api) {
      throw new HttpException('接口不存在', HttpStatus.NOT_FOUND);
    }

    // 转换为真实请求路径
    let url = null;
    if (request.originalUrl.startsWith('/origin/')) {
      url = request.originalUrl.replace(`/origin/${api.symbol}`, api.base_url);
    } else {
      url = request.originalUrl.replace(`/open/${api.symbol}`, api.base_url);
    }

    // 移除原有header
    delete request.headers.host;
    delete request.headers['content-length'];
    if (request.headers['authorization']) {
      delete request.headers['authorization'];
    }
    if (request.headers['x-real-ip']) {
      delete request.headers['x-real-ip'];
    }
    if (request.headers['x-forwarded-for']) {
      delete request.headers['x-forwarded-for'];
    }
    if (request.headers['remote-host']) {
      delete request.headers['remote-host'];
    }

    // 注入api的token
    if (api.access_token) {
      request.headers['authorization'] = api.access_token;
    }

    await this.httpService.axiosRef
      .request({
        method: request.method,
        url,
        data: request.body,
        headers: request.headers,
        responseType: 'stream',
        validateStatus: () => true,
      })
      .then((response) => {
        return new Promise<void>((resolve, reject) => {
          // 设置响应状态码
          res.status(response.status);
          // 设置响应头
          for (const [key, value] of Object.entries(response.headers)) {
            if (Array.isArray(value)) {
              res.setHeader(key, value.join(', '));
            } else {
              res.setHeader(key, value);
            }
          }

          // 转发流数据
          response.data.on('data', (chunk) => {
            // try {
            //   // 如果需要抛出错误，确保它能被捕获
            //   throw new HttpException('111', HttpStatus.BAD_GATEWAY);
            //   res.write(chunk);
            // } catch (err) {
            //   // 手动触发 error 事件，确保错误能被统一处理
            //   response.data.emit('error', err);
            // }
            res.write(chunk);
          });

          response.data.on('end', () => {
            res.end();
            resolve();
          });

          response.data.on('error', (err) => {
            console.error('Error occurred:', err.message);
            reject(err);
          });
        });
      })
      .catch((exception) => {
        console.error('Error occurred:', exception.message);
        return res.end('Internal Server Error');
      });
  }
}

import {
  Controller,
  All,
  HttpException,
  HttpStatus,
  Req,
  Logger,
  SetMetadata,
  Get,
  Query,
} from '@nestjs/common';
import { OpenService } from './open.service';
import { User, User as UserType } from 'src/user/entities/user.entity';
import { MurLockException } from 'murlock';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
// import { API } from 'src/api/api.constant';
import { ApiService } from 'src/api/api.service';
import { Request } from 'express';
import { GetUser } from 'src/user/user.decorator';
import { GetOpenDto } from './dto/get-auth.dto';

@ApiBearerAuth()
@Controller(['open', 'origin'])
export class OpenController {
  private readonly logger = new Logger(OpenController.name);

  constructor(
    private readonly openService: OpenService,
    private readonly apiService: ApiService,
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
    @GetUser() user: UserType,
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

    let charge: number = 0;
    // 验证余额是否充足
    if (api.priceType == '0') {
      charge = -Number(api.price);
      const verifyResult = await this.openService.verifyCharge(charge, user);
      if (!verifyResult) {
        throw new HttpException('余额不足', HttpStatus.FORBIDDEN);
      }
    } else {
      // 计算data长度
      let data = '';
      data += request.body ? JSON.stringify(request.body) : '';
      data += request.query ? JSON.stringify(request.query) : '';
      const dataLength = data.length;
      charge = -Number(api.price) * dataLength;
      const verifyResult = await this.openService.verifyCharge(charge, user);
      if (!verifyResult) {
        throw new HttpException('余额不足', HttpStatus.FORBIDDEN);
      }
    }

    // 转换为真实请求路径
    let url = null;
    let originFlag = false;
    if (request.originalUrl.startsWith('/origin/')) {
      originFlag = true;
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

    let response;
    try {
      response = await this.openService.request(api.symbol, {
        method: request.method,
        url,
        data: request.body,
        headers: request.headers,
      });

      // 如果为2，则双向扣费加计返回费用
      if (api.priceType == '2') {
        const data = JSON.stringify(response);
        const dataLength = data.length;
        charge += -Number(api.price) * dataLength;
      }
      // 保留两位小数，最低扣费0.01
      charge = Math.ceil(charge * 100) / 100;

      // 请求成功，扣除费用
      this.openService
        .payCharge(charge, user)
        .then(() => {
          // 日志记录计费情况
          this.openService
            .createOpenLog({
              api,
              user,
              cost: -charge,
              path: request._parsedUrl.pathname,
              count: 1,
              billCount: 1,
              api_key: request['API_KEY_ID']
                ? {
                    id: request['API_KEY_ID'],
                  }
                : undefined,
            })
            .catch((e) => {
              this.logger.error('记录接口调用日志出错', e);
            });
        })
        .catch((exception) => {
          this.logger.error('检查费用出错', exception);
          // 此处可能在高峰时刻挂锁超时报错
          if (exception instanceof MurLockException) {
            throw new HttpException(
              '您的请求过于频繁，请稍后再试',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          } else {
            throw exception;
          }
        });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (originFlag) {
      response.isPacked = true;
    }

    return response;
  }
}

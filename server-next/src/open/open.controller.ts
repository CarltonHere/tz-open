import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApisService } from 'src/apis/apis.service';
import { Api } from 'src/apis/entities/api.entity';
import { CreateOpenDto } from './dto/create-open.dto';
import { UpdateOpenDto } from './dto/update-open.dto';
import { OpenService } from './open.service';

@ApiBearerAuth()
@Controller(['open', 'origin'])
export class OpenController {
  constructor(
    private readonly openService: OpenService,
    private readonly apisService: ApisService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  create(@Body() createOpenDto: CreateOpenDto) {
    return this.openService.create(createOpenDto);
  }

  @Get()
  findAll() {
    return this.openService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.openService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpenDto: UpdateOpenDto) {
    return this.openService.update(+id, updateOpenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.openService.remove(+id);
  }

  @All(':apiName/*')
  @ApiParam({ name: 'apiName', example: 'tyc' })
  async proxy(
    @Req() clientRequest: FastifyRequest & { _parsedUrl: { pathname: string } },
    @Res() clientResponse: FastifyReply, // 获取 Express 的响应对象
    // @GetUser() user: UserType,
  ) {
    console.log(clientRequest.params);
    const userSymbol = (
      clientRequest.params as {
        apiName: string;
      }
    ).apiName;

    let api: Api | null;

    // pai平台集中路由转发处理逻辑
    if (userSymbol === 'pai') {
      // 获取请求体中的ModelName
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const modelName: string | null = (clientRequest.body as any)?.model;
      if (!modelName) {
        throw new HttpException('未指定PAI平台模型名称', HttpStatus.NOT_FOUND);
      }
      console.log('modelName', modelName);
      api = await this.apisService.findOneBySymbolCaseInsensitive(
        `pai-${modelName}`,
        {
          select: [
            'id',
            'name',
            'symbol',
            'base_url',
            'access_token',
            'status',
          ],
        },
      );
      if (!api) {
        throw new HttpException('PAI平台不存在该模型', HttpStatus.NOT_FOUND);
      }
      // 去除pai-前缀
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (clientRequest.body as any).model = api.symbol.slice(4);
    } else {
      api = await this.apisService.findOneBySymbolCaseInsensitive(userSymbol, {
        select: ['id', 'name', 'symbol', 'base_url', 'access_token', 'status'],
      });
      if (!api) {
        throw new HttpException('接口不存在', HttpStatus.NOT_FOUND);
      }
    }

    // 转换为真实请求路径
    let url: string;
    if (clientRequest.originalUrl.startsWith('/origin/')) {
      url = clientRequest.originalUrl.replace(
        `/origin/${userSymbol}`,
        api.base_url,
      );
    } else {
      url = clientRequest.originalUrl.replace(
        `/open/${userSymbol}`,
        api.base_url,
      );
    }

    let ApiHandlerClassName = `./handlers/${api.symbol}`;

    if (api.symbol.toLowerCase().startsWith('pai-')) {
      ApiHandlerClassName = `./handlers/bailian`;
    }

    import(ApiHandlerClassName)
      .then(({ ApiHandler }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const apiHandler = new ApiHandler({
          httpService: this.httpService,
          clientRequest,
          clientResponse,
          url,
          api,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        apiHandler.request();
      })
      .catch(() => {
        import(`./handlers/common`)
          .then(({ ApiHandler }: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const apiHandler = new ApiHandler({
              httpService: this.httpService,
              clientRequest,
              clientResponse,
              url,
              api,
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            apiHandler.request();
          })
          .catch(() => {});
      });
  }
}

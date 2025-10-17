import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApisService } from 'src/apis/apis.service';
import { Api } from 'src/apis/entities/api.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOpenDto } from './dto/create-open.dto';
import { UpdateOpenDto } from './dto/update-open.dto';

@Injectable()
export class OpenService {
  constructor(
    private readonly apisService: ApisService,
    private readonly httpService: HttpService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createOpenDto: CreateOpenDto) {
    return 'This action adds a new open';
  }

  findAll() {
    return `This action returns all open`;
  }

  findOne(id: number) {
    return `This action returns a #${id} open`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateOpenDto: UpdateOpenDto) {
    return `This action updates a #${id} open`;
  }

  remove(id: number) {
    return `This action removes a #${id} open`;
  }

  /**
   * 通用代理方法,用于转发请求到目标 API
   * @param clientRequest Fastify 请求对象
   * @param clientResponse Fastify 响应对象
   * @param apiSymbol API 标识符
   * @param routePrefix 路由前缀 (如 'open', 'origin', 'mcps')
   */
  async proxyRequest(
    clientRequest: FastifyRequest & {
      _parsedUrl: { pathname: string };
      user: User;
    },
    clientResponse: FastifyReply,
    apiSymbol: string,
    userSymbol?: string,
  ): Promise<void> {
    let api: Api | null;

    // pai平台集中路由转发处理逻辑
    if (apiSymbol === 'pai') {
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
      if (api) {
        // 去除pai-前缀
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (clientRequest.body as any).model = api.symbol.slice(4);
      } else {
        api = await this.apisService.findOneBySymbolCaseInsensitive(`pai`, {
          select: [
            'id',
            'name',
            'symbol',
            'base_url',
            'access_token',
            'status',
          ],
        });
      }

      if (!api) {
        throw new HttpException('PAI平台不存在该模型', HttpStatus.NOT_FOUND);
      }
    } else {
      api = await this.apisService.findOneBySymbolCaseInsensitive(apiSymbol, {
        select: ['id', 'name', 'symbol', 'base_url', 'access_token', 'status'],
      });
      if (!api) {
        throw new HttpException('该接口不存在', HttpStatus.NOT_FOUND);
      }
    }

    // 转换为真实请求路径,只分割第一个 symbol
    const symbol = userSymbol || apiSymbol;
    const symbolIndex = clientRequest.originalUrl.indexOf(symbol);

    if (symbolIndex === -1) {
      throw new HttpException('无效的请求路径', HttpStatus.BAD_REQUEST);
    }

    const pathPart = clientRequest.originalUrl.slice(
      symbolIndex + symbol.length,
    );

    // 智能拼接 URL,处理斜杠
    const url = `${api.base_url.replace(/\/$/, '')}/${pathPart.replace(/^\//, '')}`;

    let ApiHandlerClassName = `./handlers/${api.symbol}`;

    if (
      api.symbol.toLowerCase().startsWith('pai-') ||
      api.symbol.toLowerCase() === 'pai'
    ) {
      ApiHandlerClassName = `./handlers/bailian`;
    }

    // 使用 await 等待请求完成,确保不会阻塞其他请求
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { ApiHandler } = await import(ApiHandlerClassName).catch(
      () => import(`./handlers/common`),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const apiHandler = new ApiHandler({
      httpService: this.httpService,
      clientRequest,
      clientResponse,
      url,
      api,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await apiHandler.request();
  }
}

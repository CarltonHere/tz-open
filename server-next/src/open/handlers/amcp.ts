import { HttpService } from '@nestjs/axios';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CommonApiResponse, ErrorShowType } from 'src/commons/dto/api.response';
import { Api } from '../../apis/entities/api.entity';

export class ApiHandler {
  private readonly httpService: HttpService;
  private readonly clientRequest: FastifyRequest;
  private readonly clientResponse: FastifyReply;
  private readonly url: string;
  private readonly api: Api;
  constructor({
    httpService,
    clientRequest,
    clientResponse,
    api,
    url,
  }: {
    httpService: HttpService;
    clientRequest: FastifyRequest;
    clientResponse: FastifyReply;
    url: string;
    api: Api;
  }) {
    this.httpService = httpService;
    this.clientRequest = clientRequest;
    this.clientResponse = clientResponse;
    this.url = url;
    this.api = api;
  }
  request() {
    // 移除原有header
    delete this.clientRequest.headers.host;
    delete this.clientRequest.headers['content-length'];
    if (this.clientRequest.headers['authorization']) {
      delete this.clientRequest.headers['authorization'];
    }
    if (this.clientRequest.headers['x-real-ip']) {
      delete this.clientRequest.headers['x-real-ip'];
    }
    if (this.clientRequest.headers['x-forwarded-for']) {
      delete this.clientRequest.headers['x-forwarded-for'];
    }
    if (this.clientRequest.headers['remote-host']) {
      delete this.clientRequest.headers['remote-host'];
    }
    // 移除origin和referer相关的header,避免CORS问题
    if (this.clientRequest.headers['origin']) {
      delete this.clientRequest.headers['origin'];
    }
    if (this.clientRequest.headers['referer']) {
      delete this.clientRequest.headers['referer'];
    }

    // 注入api的token
    if (this.api.access_token) {
      this.clientRequest.headers['authorization'] = this.api.access_token;
    }

    this.httpService.axiosRef
      .request({
        method: this.clientRequest.method,
        url: this.url,
        data: this.clientRequest.body,
        headers: this.clientRequest.headers,
        responseType: 'stream',
        validateStatus: () => true,
      })
      .then(async (response) => {
        return await new Promise<void>((resolve, reject) => {
          // 设置响应状态码
          this.clientResponse.hijack();
          this.clientResponse.raw.statusCode = response.status;
          // 设置响应头
          for (const [key, value] of Object.entries(response.headers)) {
            // 过滤掉可能导致CORS问题的响应头
            const lowerKey = key.toLowerCase();
            if (
              lowerKey.startsWith('access-control-') ||
              lowerKey === 'origin'
            ) {
              continue;
            }
            if (Array.isArray(value)) {
              this.clientResponse.raw.setHeader(key, value.join(', '));
            } else {
              this.clientResponse.raw.setHeader(key, value as string);
            }
          }

          // 转发流数据
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('data', (chunk: Buffer) => {
            // 将 chunk 转换为字符串
            const chunkStr: string = chunk.toString('utf-8');

            if (chunkStr.includes('/api/v1/mcps/')) {
              return this.clientResponse.raw.write(
                chunkStr.replace('/api/v1/mcps/', '/open/amcp/'),
              );
            }

            // 写入处理后的消息
            this.clientResponse.raw.write(chunk);
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('end', () => {
            console.log('Response stream ended');
            resolve();
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('error', (exception: Error) => {
            console.error('Error occurred:', exception.message);
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              response?.data?.destroy?.();
            } catch {
              /* empty */
            }
            reject(exception);
          });
        });
      })
      .catch((exception: Error) => {
        console.error('Error occurred:', exception.message);
        this.clientResponse.raw.end(
          'data: ' +
            JSON.stringify(
              new CommonApiResponse({
                data: [],
                path: this.clientRequest.url,
                success: false,
                errorCode: this.clientResponse.raw.statusCode,
                errorMessage: '请求失败',
                showType: ErrorShowType.ERROR_MESSAGE,
              }),
            ) +
            '\n\n',
        );
      })
      .finally(() => {
        console.log('finally');
        this.clientResponse.raw.end();
      });
  }
}

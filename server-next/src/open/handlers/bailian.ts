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
    const clientHeaders = this.clientRequest.headers;
    delete clientHeaders.host;
    delete clientHeaders['content-length'];
    if (clientHeaders['authorization']) {
      delete clientHeaders['authorization'];
    }
    if (clientHeaders['x-real-ip']) {
      delete clientHeaders['x-real-ip'];
    }
    if (clientHeaders['x-forwarded-for']) {
      delete clientHeaders['x-forwarded-for'];
    }
    if (clientHeaders['remote-host']) {
      delete clientHeaders['remote-host'];
    }

    // 注入api的token
    if (this.api.access_token) {
      clientHeaders['authorization'] = this.api.access_token;
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
            if (Array.isArray(value)) {
              this.clientResponse.raw.setHeader(key, value.join(', '));
            } else {
              this.clientResponse.raw.setHeader(key, value as string);
            }
          }

          // 转发流数据
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('data', (chunk) => {
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

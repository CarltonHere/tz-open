import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
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
  async request(): Promise<void> {
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

    this.clientRequest.headers = {
      ...this.clientRequest.headers,
      ...this.generateBidataHeader(),
    };

    return this.httpService.axiosRef
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
            // 仅允许白名单header设置
            if (
              !['content-type', 'set-cookie'].includes(key.toLocaleLowerCase())
            ) {
              continue;
            }
            if (Array.isArray(value)) {
              this.clientResponse.raw.setHeader(key, value.join(', '));
            } else {
              this.clientResponse.raw.setHeader(key, value as string);
            }
          }

          // 直接使用 pipe 转发流数据,提高 SSE 效率
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.pipe(this.clientResponse.raw);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('end', () => {
            console.log('Response stream ended');
            this.clientResponse.raw.end();
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
        this.clientResponse.raw.write(
          JSON.stringify(
            new CommonApiResponse({
              data: [],
              path: this.clientRequest.url,
              success: false,
              errorCode: this.clientResponse.raw.statusCode,
              errorMessage: '请求失败',
              showType: ErrorShowType.ERROR_MESSAGE,
            }),
          ),
        );
        this.clientResponse.raw.end();
      });
  }

  generateBidataHeader() {
    // 定义参数
    const xNonce = crypto.randomBytes(4).readUInt16BE(0).toString();
    const securityKey =
      'LdTZe0s0MGSXudVLJQhP03C1jl1F18sC6VLV7KTQdeJ4W8G1JhPcflRt7wEU8uuC'; // 替换为实际的 SecurityKey
    const xTimestamp = new Date().getTime().toString();
    const xUid = '5LZQQCUB';

    // 拼接字符串
    const data = `${xNonce};${securityKey};${xTimestamp};${xUid};`;
    // 计算 SHA1 签名
    const sha1Signature = crypto.createHash('sha1').update(data).digest('hex');
    console.log('SHA1 签名:', sha1Signature);
    return {
      'X-Nonce': xNonce,
      'X-Timestamp': xTimestamp,
      'X-Uid': xUid,
      'X-Signature': sha1Signature,
    };
  }
}

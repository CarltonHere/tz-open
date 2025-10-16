import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { rsaEncrypt } from 'src/commons/crypto.utils';
import { CommonApiResponse, ErrorShowType } from 'src/commons/dto/api.response';
import { User } from 'src/users/entities/user.entity';
import { Api } from '../../apis/entities/api.entity';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk+/EOpc/IUFZciKyfOGg
sYp3l1uvbLCxqf5Yi3Q5YjEjZScZrph36DZ7gsq6/ElbhDX03BEcuyaxraDWaljm
XQUExddM6TL71WYegNGsQDoktDctkJ70flMzwvHLvogH93vpt/FwEASImcx23ldS
uZqxD6gFdn+QY6nWjlcm1d5374PPrTnvSDAkeB16IAxvsExFcq24kQ8355d3ECM/
89rPXc3eOhMj54ICwqjyVhhKIEf/oJUXhyUWKyK3jAkcF7/VPewepeATsEBQfAyS
kEcFv5Y+AQMOZkEHDSGozjLYJYi2zT1Fcbwf5phqtHoPLhjK+MW7kK/4p37CQMvU
8wIDAQAB
-----END PUBLIC KEY-----`;

export class ApiHandler {
  private readonly httpService: HttpService;
  private readonly clientRequest: FastifyRequest & {
    _parsedUrl: { pathname: string };
    user: User;
  };
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
    clientRequest: FastifyRequest & {
      _parsedUrl: { pathname: string };
      user: User;
    };
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

    // 注入api的token
    if (this.api.access_token) {
      this.clientRequest.headers['authorization'] = this.api.access_token;
    }

    // 注入用户id
    if (!this.clientRequest?.user?.username) {
      throw new HttpException('获取用户元信息异常', 403);
    }

    this.clientRequest.headers['user_id'] = rsaEncrypt(
      publicKey,
      this.clientRequest.user.username,
    );

    // 检查是否是 multipart 请求
    const contentType = this.clientRequest.headers['content-type'] || '';
    const isMultipart = contentType
      .toLowerCase()
      .includes('multipart/form-data');

    // 对于 multipart 请求,使用原始流;否则使用解析后的 body
    const requestData = isMultipart
      ? this.clientRequest.raw
      : this.clientRequest.body;

    return this.httpService.axiosRef
      .request({
        method: this.clientRequest.method,
        url: this.url,
        data: requestData,
        headers: this.clientRequest.headers,
        responseType: 'stream',
        validateStatus: () => true,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then(async (response) => {
        return await new Promise<void>((resolve, reject) => {
          // 设置响应状态码
          this.clientResponse.hijack();
          this.clientResponse.raw.statusCode = response.status;
          // 设置响应头
          for (const [key, value] of Object.entries(response.headers)) {
            // 仅允许以下白名单header设置
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

          // 直接使用 pipe 转发流数据
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.pipe(this.clientResponse.raw);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          response.data.on('end', () => {
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
        if (!this.clientResponse.raw.writableEnded) {
          this.clientResponse.raw.write(
            JSON.stringify(
              new CommonApiResponse({
                data: [],
                path: this.clientRequest.url,
                success: false,
                errorCode: this.clientResponse.raw.statusCode || 500,
                errorMessage: exception.message || '请求失败',
                showType: ErrorShowType.ERROR_MESSAGE,
              }),
            ),
          );
        }
      })
      .finally(() => {
        if (!this.clientResponse.raw.writableEnded) {
          this.clientResponse.raw.end();
        }
      });
  }
}

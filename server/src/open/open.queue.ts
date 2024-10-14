import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue, QueueEvents, Worker } from 'bullmq';
@Injectable()
export class OpenQueue {
  private readonly logger = new Logger(OpenQueue.name);
  private readonly queues: { [key: string]: Queue } = {};
  private readonly queueEvents: { [key: string]: QueueEvents } = {};
  private readonly workers: { [key: string]: Worker } = {};
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async createQueue(symbol: string): Promise<void> {
    const queue = new Queue(symbol, {
      connection: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
      },
    });
    this.queues[symbol] = queue;
    this.queueEvents[symbol] = new QueueEvents(symbol, {
      connection: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
      },
    });
    this.workers[symbol] = new Worker(
      symbol,
      async (job: Job) => {
        try {
          const { config } = job.data;
          const remoteRes = await this.httpService.axiosRef.request({
            ...config,
            timeout: 50000,
          });
          return {
            data: remoteRes.data,
          };
        } catch (exception) {
          if (!exception.response?.status) {
            this.logger.error(
              `Error occurred: ${exception.message}`,
              exception.stack,
            );
            throw new HttpException(
              '无法连接远程资源服务器',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          if (exception.response?.status === 418) {
            this.logger.error(
              `Error occurred: ${exception.message}`,
              exception.stack,
            );
            this.logger.error(`Response Data`, exception.response.data);
            throw new HttpException(
              '远程资源已高峰限流，请稍后再试',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          if (exception.response?.status === 414) {
            this.logger.error(
              `Error occurred: ${exception.message}`,
              exception.stack,
            );
            this.logger.error(`Response Data`, exception.response.data);
            throw new HttpException(
              '请求参数过长，请检查后重试',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          throw new HttpException(
            exception.response.data,
            exception.response.status,
          );
        }
      },
      {
        concurrency: 90,
        limiter: {
          max: 90,
          duration: 1000,
        },
        connection: {
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
          password: this.configService.get<string>('REDIS_PASSWORD'),
        },
      },
    );
  }
  async addJob(symbol: string, data: any) {
    if (!this.queues[symbol]) {
      // 处理找不到队列的情况
      await this.createQueue(symbol);
    }
    const queue = this.queues[symbol];
    const ttl = await queue.getRateLimitTtl();
    // 判断等待时长是否过长
    if (ttl > 20000) {
      this.logger.error(`${symbol}队列过长，需等待${ttl}`);
      throw new HttpException(
        '当前为高峰时段，前方排队人数过多，请稍后再试',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const job = await queue.add('proxyJob-' + symbol, data);
    let res = '';
    try {
      // 此处超时可以设长一些，因为axios会先抛出http超时
      res = await job.waitUntilFinished(this.queueEvents[symbol], 60000);
    } catch (exception) {
      if (exception.message.includes('timed out')) {
        this.logger.error('队列成员超时，强制断开');
        throw new HttpException(
          '远程资源服务器超时',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      let errorInfo = null;
      try {
        // 尝试解析错误详情
        errorInfo = JSON.parse(exception.message);
      } catch {}
      if (errorInfo) {
        throw new HttpException(errorInfo.message, errorInfo.status);
      }
      throw exception;
    }
    return res;
  }
}

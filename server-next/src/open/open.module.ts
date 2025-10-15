import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';
import { ApisModule } from 'src/apis/apis.module';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';

@Module({
  imports: [ApisModule, HttpModule],
  controllers: [OpenController],
  providers: [OpenService],
})
export class OpenModule implements OnModuleInit {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  onModuleInit() {
    const fastifyInstance: FastifyInstance =
      this.adapterHost.httpAdapter.getInstance();

    // 对于 /open 路由的 multipart 请求,跳过解析,保留原始流用于转发
    fastifyInstance.addContentTypeParser(
      'multipart/form-data',
      (req, payload, done) => {
        const url = req.url || '';
        // 只对 /open 路由跳过解析
        if (url.startsWith('/open/') || url.startsWith('/origin/')) {
          // 不解析,直接传递 null,保留原始流
          done(null, null);
        } else {
          // 其他路由抛出 Unsupported Media Type 错误
          const contentType = req.headers['content-type'] || '';
          done(new Error(`Unsupported Media Type: ${contentType}`), undefined);
        }
      },
    );
  }
}

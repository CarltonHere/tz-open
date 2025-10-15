import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';
import { ApisModule } from 'src/apis/apis.module';
import { McpsController } from './mcps.controller';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';

@Module({
  imports: [ApisModule, HttpModule],
  controllers: [OpenController, McpsController],
  providers: [OpenService],
  exports: [OpenService], // 导出 OpenService 以便其他模块使用
})
export class OpenModule implements OnModuleInit {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  onModuleInit() {
    const fastifyInstance: FastifyInstance =
      this.adapterHost.httpAdapter.getInstance();

    // 对于代理路由的 multipart 请求,跳过解析,保留原始流用于转发
    fastifyInstance.addContentTypeParser(
      'multipart/form-data',
      (req, payload, done) => {
        const url = req.url || '';
        // 对 /open、/origin、/mcps 路由跳过解析
        if (
          url.startsWith('/open/') ||
          url.startsWith('/origin/') ||
          url.startsWith('/api/v1/mcps/')
        ) {
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

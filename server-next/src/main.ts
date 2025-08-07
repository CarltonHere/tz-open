import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrimaryExceptionFilter } from './commons/exception.filter';
import { SwaggerService } from './commons/swagger.service';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 100 * 1024 * 1024, // 100MB
      ignoreTrailingSlash: true,
    }),
  );
  app.useGlobalFilters(new PrimaryExceptionFilter());
  const configService = app.get(ConfigService);
  SwaggerService.createDocument(app);
  app.enableCors();
  await app
    .listen(
      configService.getOrThrow<string | number>('SERVER_PORT', 3000),
      '0.0.0.0',
    )
    .then((server) => {
      logger.log('Opened server on', server.address());
    });
}
bootstrap();

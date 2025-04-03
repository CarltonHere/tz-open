import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrimaryExceptionFilter } from './commons/exception.filter';
import { SwaggerService } from './commons/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalFilters(new PrimaryExceptionFilter());
  const configService = app.get(ConfigService);
  SwaggerService.createDocument(app);
  app.enableCors();
  await app.listen(
    configService.getOrThrow<string | number>('SERVER_PORT', 3000),
  );
}
bootstrap();

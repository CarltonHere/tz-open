import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const logger = new Logger('MainProcess');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  if (configService.getOrThrow('ENVIRONMENT') === 'development') {
    SwaggerModule.setup('doc', app, document);
  }
  // app.useGlobalFilters(new PrimaryExceptionFilter());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );
  await app.listen(configService.getOrThrow('SERVER_PORT')).then(() => {
    app
      .getUrl()
      .then((fqdn) => logger.log(`Application is running on: ${fqdn}`));
  });
}
bootstrap();

import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';

@Injectable()
export class SwaggerService {
  private static document?: OpenAPIObject;

  public static createDocument(application: INestApplication) {
    SwaggerService.document = SwaggerModule.createDocument(
      application,
      new DocumentBuilder()
        .addBearerAuth()
        .setTitle('NestJS API')
        .setDescription('The NestJS API description')
        .setVersion('1.0')
        .build(),
    );

    SwaggerModule.setup('doc', application, SwaggerService.document);
  }

  public getDocument() {
    return SwaggerService.document;
  }
}

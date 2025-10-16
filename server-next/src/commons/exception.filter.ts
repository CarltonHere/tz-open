/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CommonApiResponse, ErrorShowType } from './dto/api.response';

@Catch()
export class PrimaryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrimaryExceptionFilter.name);
  catch<T extends HttpException>(exception: T, host: ArgumentsHost) {
    this.logger.error(`Error occurred: ${exception.message}`, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let errorCode, errorMessage, showType;

    console.log(exception.name, exception.message);

    if (typeof exception['getStatus'] === 'function') {
      errorCode = exception.getStatus();

      errorMessage = exception.getResponse()?.['message'] ?? exception.message;

      showType = exception.getResponse()['showType'];
    } else {
      errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = exception?.message
        ? exception.message
        : exception?.name
          ? exception.name
          : 'Internal Server Error';
    }

    const errorResponse = new CommonApiResponse({
      data: [],
      path: request.url,
      success: false,
      errorCode,
      errorMessage,
      showType: showType ?? ErrorShowType.ERROR_MESSAGE,
    });

    // 检查响应是否已经被 hijack (代理请求的情况)
    if (response.raw && !response.raw.writableEnded) {
      // 处理被 hijack 的响应
      response.raw.statusCode = errorCode;
      response.raw.setHeader('Content-Type', 'application/json');
      response.raw.write(JSON.stringify(errorResponse));
      response.raw.end();
    } else if (!response.sent && !response.raw?.writableEnded) {
      // 处理普通响应
      return response.status(errorCode).send(errorResponse);
    }
    // 如果响应已经结束,不做任何操作
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from '../transform/dto/transform-api.response';

@Catch()
export class PrimaryExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(PrimaryExceptionFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    // 打印错误日志
    if (exception instanceof NotFoundException) {
      this.logger.error(exception);
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Resource Not Found';
    } else if (exception instanceof HttpException) {
      this.logger.error(
        `Error occurred: ${exception.message}`,
        exception.stack,
      );
      statusCode = exception.getStatus();
      message = exception.getResponse()['message']
        ? exception.getResponse()['message']
        : exception.message;
    } else if (exception instanceof Error) {
      if (exception.message.includes('ENOENT: no such file or directory')) {
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Resource Not Found';
      } else {
        this.logger.error(
          `Error occurred: ${exception.message}`,
          exception.stack,
        );
        message =
          exception.name == 'Error'
            ? exception.message
              ? exception.message
              : exception.name
            : exception.name;
      }
    } else {
      this.logger.error(exception);
    }

    response
      .status(statusCode)
      .json(new ApiResponse([], statusCode, request.url, message));
  }
}

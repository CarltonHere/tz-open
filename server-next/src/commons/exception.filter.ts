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

    return response.status(errorCode).send(
      new CommonApiResponse({
        data: [],
        path: request.url,
        success: false,
        errorCode,
        errorMessage,
        showType: showType ?? ErrorShowType.ERROR_MESSAGE,
      }),
    );
  }
}

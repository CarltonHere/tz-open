import { FastifyReply } from 'fastify';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonApiResponse, RawApiResponse } from '../commons/dto/api.response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CommonApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonApiResponse<T>> {
    return next.handle().pipe(
      map((body) => {
        const response: FastifyReply = context.switchToHttp().getResponse();
        if (body instanceof CommonApiResponse) {
          if (!body.path) {
            body.path = response.request.url;
          }
          return body;
        } else if (body instanceof RawApiResponse) {
          return body.payload;
        }
        return new CommonApiResponse<T>({
          data: body,
          path: response.request.url,
        });
      }),
    );
  }
}

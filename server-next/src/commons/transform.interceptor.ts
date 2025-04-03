/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CommonApiResponse } from '../commons/dto/api.response';

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
        const res = context.switchToHttp().getResponse();
        if (body instanceof CommonApiResponse) {
          if (!body.path) {
            body.path = res.req.url;
          }
          return body;
        }
        return body;
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './dto/transform-api.response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((body) => {
        const res = context.switchToHttp().getResponse();
        body = body ? body : '';
        const isPacked = body.isPacked ? body.isPacked : false;
        const data = body.data ? body.data : body;
        const statusCode = Number(body.code) ? Number(body.code) : 200;
        const path = body.path ? body.path : res.req.url;
        const message = body.message ? body.message : 'Success';
        const timestamp = body.timestamp
          ? body.timestamp
          : new Date().getTime();
        res.status(statusCode);
        if (isPacked) {
          return data;
        }
        return new ApiResponse<T>(data, statusCode, path, message, timestamp);
      }),
    );
  }
}

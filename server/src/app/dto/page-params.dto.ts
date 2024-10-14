import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PageParamsDto {
  @Type(() => Number)
  @IsNumber({}, { message: '页码格式错误' })
  @Min(1)
  current?: number;
  @Type(() => Number)
  @IsNumber({}, { message: '页面尺寸格式错误' })
  @Max(100)
  @Min(1)
  pageSize?: number;
}

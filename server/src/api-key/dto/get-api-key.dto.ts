import { PartialType } from '@nestjs/swagger';
import { ApiKey } from '../entities/api-key.entity';
import { Type } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';

export class GetApiKeyDto extends PartialType(ApiKey) {
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

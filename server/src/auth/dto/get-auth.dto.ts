import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';
import { Auth } from '../entities/auth.entity';

export class GetAuthDto extends PartialType(Auth) {
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

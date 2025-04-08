import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateApiDto {
  @ApiProperty({
    description: '接口名称',
    example: '天眼查',
  })
  @IsNotEmpty({ message: '接口名称不能为空' })
  @IsString({ message: '接口名称格式错误' })
  name: string;

  @ApiProperty({
    description: '接口标记',
    example: 'tyc',
  })
  @IsNotEmpty({ message: '接口标记不能为空' })
  @IsString({ message: '接口标记格式错误' })
  symbol: string;

  @ApiProperty({
    description: '接口地址',
    example: '接口地址',
  })
  @IsNotEmpty({ message: '接口地址不能为空' })
  @IsString({ message: '接口地址格式错误' })
  base_url: string;

  @ApiProperty({
    description: '接口令牌',
    example: '接口令牌',
  })
  @IsString({ message: '接口令牌格式错误' })
  access_token: string;

  @ApiProperty({
    description: '最大并发数',
    example: '接口每分钟的最大请求数量',
  })
  @IsInt()
  concurrency: number;
}

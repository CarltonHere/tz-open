import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { APP_CONST } from '../../app/constant/app.constant';

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
    description: '接口单价',
    example: 1.2,
  })
  @IsNumber({}, { message: '接口单价格式错误' })
  price: number;

  @ApiProperty({
    type: 'enum',
    description: `计价类型 ${JSON.stringify(APP_CONST.price_types)}`,
    enum: Object.keys(APP_CONST.price_types),
    example: '0',
  })
  @IsEnum(Object.keys(APP_CONST.price_types), {
    message: '接口计费类型格式错误',
  })
  priceType: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class RefreshAccessTokenDto {
  @ApiProperty({
    description: '刷新令牌',
    example: '123',
  })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  @IsString({ message: '刷新令牌格式错误' })
  refresh_token: string;
}

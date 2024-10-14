import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class LoginByPasswordDto {
  @ApiProperty({
    description: '用户名',
    example: '123',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名格式错误' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式错误' })
  password: string;
}

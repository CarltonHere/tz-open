import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';
export class CreateUserDto {
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

  @ApiProperty({
    description: '邮箱',
    example: '123@123.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString({ message: '邮箱格式错误' })
  @IsEmail({}, { message: '邮箱格式错误' })
  email: string;

  @ApiProperty({
    description: '昵称',
    example: '123',
  })
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称格式错误' })
  name: string;

  @IsString({ message: '头像格式错误' })
  @IsUrl({}, { message: '头像格式错误' })
  avatar?: string;
}

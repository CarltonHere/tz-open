import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: '用户组名',
    example: 'Admin',
  })
  @IsNotEmpty({ message: '用户组名不能为空' })
  @IsString({ message: '用户组名格式错误' })
  name: string;
}

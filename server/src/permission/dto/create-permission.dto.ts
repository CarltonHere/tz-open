import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { APP_CONST } from 'src/app/constant/app.constant';
import { Role } from 'src/role/entities/role.entity';

export class CreatePermissionDto {
  @ApiProperty({
    description: '路径',
    example: '/open/*',
  })
  @IsNotEmpty({ message: '路径不能为空' })
  @IsString({ message: '路径格式错误' })
  path: string;

  @ApiProperty({
    type: 'enum',
    description: `请求类型 ${JSON.stringify(APP_CONST.method_types)}`,
    enum: Object.keys(APP_CONST.method_types),
    example: '0',
  })
  @IsEnum(Object.keys(APP_CONST.method_types), {
    message: '请求类型格式错误',
  })
  method: string;

  @ApiProperty({
    type: 'enum',
    description: `权限类型 ${JSON.stringify(APP_CONST.permission_types)}`,
    enum: Object.keys(APP_CONST.permission_types),
    example: '0',
  })
  @IsEnum(Object.keys(APP_CONST.permission_types), {
    message: '权限类型格式错误',
  })
  type: string;

  roles?: Role[];
}

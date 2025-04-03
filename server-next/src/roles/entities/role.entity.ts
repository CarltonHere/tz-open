import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum ROLE_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class Role extends EnhancedBaseEntity {
  @Allow()
  @ApiProperty({
    title: '名称',
    example: '管理员',
  })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  @Allow()
  @ApiProperty({
    title: '状态',
    description: JSON.stringify(Object.keys(ROLE_STATUS)),
    example: ROLE_STATUS.ENABLED,
    required: false,
  })
  @Column({
    type: 'enum',
    enum: Object.values(ROLE_STATUS),
    default: ROLE_STATUS.ENABLED,
  })
  status?: string;

  @Allow()
  @ApiProperty({
    title: '描述信息',
    example: '角色描述信息',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '描述格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description?: string;

  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Permission)
  @ApiProperty({
    description: '权限',
    type: () => [Permission],
    required: false,
  })
  @OneToMany(() => Permission, (permission) => permission.role, {
    cascade: true,
  })
  permissions?: Permission[];

  @Allow()
  @OneToMany(() => User, (user) => user.role)
  users?: User[];
}

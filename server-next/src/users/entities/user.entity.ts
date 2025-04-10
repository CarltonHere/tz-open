import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum USER_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class User extends EnhancedBaseEntity {
  @Allow()
  @ApiProperty({
    title: '名称',
    example: '昵称',
  })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Allow()
  @ApiProperty({
    title: '用户名',
    example: '用户名',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  username: string;

  @Allow()
  @ApiProperty({
    title: '密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @Allow()
  @ApiProperty({
    title: '邮箱',
  })
  @IsOptional()
  @IsEmail()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Allow()
  @ApiProperty({
    title: '头像',
  })
  @IsOptional()
  @IsString({ message: '头像格式错误' })
  @IsUrl({}, { message: '头像格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatar?: string;

  @Allow()
  @ApiProperty({
    title: '角色',
    type: () => Role,
    required: false,
  })
  @ManyToOne(() => Role, {
    cascade: true,
  })
  role?: Role;

  @Allow()
  @ApiProperty({
    title: '状态',
    description: JSON.stringify(Object.keys(USER_STATUS)),
  })
  @Column({
    type: 'enum',
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ENABLED,
  })
  status?: string;

  // own_items?: Order[] | Setting[];
}

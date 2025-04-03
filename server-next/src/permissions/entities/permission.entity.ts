import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PERMISSION_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}
export enum PERMISSION_TYPE {
  WEB = '0',
  SERVICE = '1',
}

export enum PERMISSION_STRATEGY {
  GLOBAL = '0',
  PERSONAL = '1',
}

@Entity()
export class Permission extends EnhancedBaseEntity {
  @Allow()
  @Column({
    type: 'varchar',
    length: 255,
    default: 'PermissionRule',
  })
  name?: string;

  @Allow()
  @IsNotEmpty({ message: '类型不能为空' })
  @IsEnum(PERMISSION_TYPE, { message: '类型格式错误' })
  @Column({
    type: 'enum',
    enum: PERMISSION_TYPE,
    default: PERMISSION_TYPE.WEB,
  })
  type: string;

  @Allow()
  @IsNotEmpty({ message: '路径不能为空' })
  @IsString({ message: '路径格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  path: string;

  @Allow()
  @IsNotEmpty({ message: '方法不能为空' })
  @IsString({ message: '方法格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  method: string;

  @Allow()
  @Column({
    type: 'enum',
    enum: PERMISSION_STRATEGY,
    default: PERMISSION_STRATEGY.GLOBAL,
  })
  strategy?: string;

  @Allow()
  @ManyToOne(() => Role, (role) => role.permissions)
  role?: Role;

  @Allow()
  @ApiProperty({
    title: '状态',
    description: JSON.stringify(Object.keys(PERMISSION_STATUS)),
  })
  @Column({
    type: 'enum',
    enum: PERMISSION_STATUS,
    default: PERMISSION_STATUS.ENABLED,
  })
  status?: string;
}

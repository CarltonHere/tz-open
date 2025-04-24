import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum API_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class Api extends EnhancedBaseEntity {
  @ApiProperty({
    description: '接口名称',
    example: '天眼查',
  })
  @IsNotEmpty({ message: '接口名称不能为空' })
  @IsString({ message: '接口名称格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: '接口标记',
    example: 'tyc',
  })
  @IsNotEmpty({ message: '接口标记不能为空' })
  @IsString({ message: '接口标记格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  symbol: string;

  @ApiProperty({
    description: '接口地址',
    example: '接口地址',
  })
  @IsNotEmpty({ message: '接口地址不能为空' })
  @IsString({ message: '接口地址格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  base_url: string;

  @ApiProperty({
    description: '接口令牌',
    example: '接口令牌',
  })
  @IsString({ message: '接口令牌格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    select: false,
  })
  access_token: string;

  @Type(() => Number)
  @ApiProperty({
    description: '最大并发数',
    example: '接口每分钟的最大请求数量',
  })
  @IsInt()
  @Column({
    type: 'varchar',
    length: 255,
    default: -1,
  })
  concurrency: number;

  @Allow()
  @Column({
    type: 'enum',
    enum: Object.values(API_STATUS),
    default: API_STATUS.ENABLED,
  })
  status?: string;
}

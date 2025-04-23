import { Allow } from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum API_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class Api extends EnhancedBaseEntity {
  @Allow()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Allow()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  symbol: string;

  @Allow()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  base_url: string;

  @Allow()
  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    select: false,
  })
  access_token: string;

  @Allow()
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

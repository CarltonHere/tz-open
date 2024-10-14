import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { APP_CONST } from '../../app/constant/app.constant';
@Entity()
export class Api {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  symbol: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  base_url: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    select: false,
  })
  access_token: string;

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.price_types),
  })
  priceType: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '1',
  })
  version: string;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.status_types),
  })
  status?: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_time: Date;
}

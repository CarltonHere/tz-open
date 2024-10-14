import { ApiKey } from 'src/api-key/entities/api-key.entity';
import { Api } from 'src/api/entities/api.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  Index,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Open {
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
  path: string;

  @Column({
    type: 'int',
    default: 0,
  })
  count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  billCount: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cost: number;

  @ManyToOne(() => Api)
  api: Api;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ApiKey, { nullable: true })
  api_key: ApiKey;

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_time: Date;
}

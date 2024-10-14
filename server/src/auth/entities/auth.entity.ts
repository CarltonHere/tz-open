import { APP_CONST } from 'src/app/constant/app.constant';
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
} from 'typeorm';

@Entity()
export class Auth {
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
  method: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  ip: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @ManyToOne(() => User, {
    nullable: true,
  })
  user: User;

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

import { User } from '../../user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  Generated,
  Index,
} from 'typeorm';
@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    default: 0,
  })
  amount: number;

  @OneToOne(() => User, (user) => user.balance)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_time: Date;
}

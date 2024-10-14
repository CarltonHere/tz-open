import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
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
export class ApiKey {
  @Type(() => Number)
  @IsNumber({}, { message: 'ID格式错误' })
  @PrimaryGeneratedColumn()
  id?: number;

  @Index({ unique: true })
  @Column()
  @Generated('uuid')
  uuid?: string;

  @ManyToOne(() => User)
  user?: User;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.status_types),
  })
  status?: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_time?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_time?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_time?: Date;
}

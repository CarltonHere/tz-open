import { APP_CONST } from 'src/app/constant/app.constant';
import { Role } from 'src/role/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  Index,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Permission {
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
    unique: true,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.permission_types),
  })
  method: string;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.permission_types),
  })
  type: string;

  @Column({
    type: 'enum',
    enum: Object.keys(APP_CONST.status_types),
  })
  status?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_time: Date;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum APIKEY_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class ApiKey extends EnhancedBaseEntity {
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称格式错误' })
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @ManyToOne(() => User)
  user?: User;

  @Column({
    type: 'enum',
    enum: Object.values(APIKEY_STATUS),
    default: APIKEY_STATUS.ENABLED,
  })
  status?: string;
}

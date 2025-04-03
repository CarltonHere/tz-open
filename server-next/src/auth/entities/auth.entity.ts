import { EnhancedBaseEntity } from 'src/commons/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

enum AUTH_STATUS {
  ENABLED = '0',
  DISABLED = '1',
}

@Entity()
export class Auth extends EnhancedBaseEntity {
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
    enum: Object.keys(AUTH_STATUS),
  })
  status?: string;
}

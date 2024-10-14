import { User } from 'src/user/entities/user.entity';

export class CreateAuthDto {
  method: string;

  type: string;

  ip: string;

  username: string;

  password: string;

  user?: User;

  status?: string;
}

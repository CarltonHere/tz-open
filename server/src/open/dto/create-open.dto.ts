import { ApiKey } from 'src/api-key/entities/api-key.entity';
import { Api } from 'src/api/entities/api.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateOpenDto {
  path: string;
  count: number;
  billCount: number;
  cost: number;

  api: Api;

  user: User;

  api_key?: ApiKey;
}

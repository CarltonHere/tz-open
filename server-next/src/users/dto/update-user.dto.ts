import { PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUsersDto extends PartialType(User) {}

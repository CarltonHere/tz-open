import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from 'src/commons/dto/query.dto';
import { User } from '../entities/user.entity';

export class GetUsersDto extends IntersectionType(
  PartialType(User),
  QueryDto,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { QueryDto, QueryPartialType } from 'src/commons/dto/query.dto';
import { User } from '../entities/user.entity';

export class GetUsersDto extends IntersectionType(
  QueryPartialType(User),
  QueryDto,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { QueryDto, QueryPartialType } from 'src/commons/dto/query.dto';
import { Role } from '../entities/role.entity';

export class GetRoleDto extends IntersectionType(
  QueryPartialType(Role),
  QueryDto,
) {}

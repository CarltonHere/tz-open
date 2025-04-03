import { IntersectionType } from '@nestjs/swagger';
import { QueryDto, QueryPartialType } from 'src/commons/dto/query.dto';
import { Permission } from '../entities/permission.entity';

export class GetPermissionDto extends IntersectionType(
  QueryPartialType(Permission),
  QueryDto,
) {}

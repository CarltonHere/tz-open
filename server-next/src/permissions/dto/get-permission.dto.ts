import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from 'src/commons/dto/query.dto';
import { Permission } from '../entities/permission.entity';

export class GetPermissionDto extends IntersectionType(
  PartialType(Permission),
  QueryDto,
) {}

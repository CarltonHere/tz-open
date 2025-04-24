import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from 'src/commons/dto/query.dto';
import { Role } from '../entities/role.entity';

export class GetRoleDto extends IntersectionType(PartialType(Role), QueryDto) {}

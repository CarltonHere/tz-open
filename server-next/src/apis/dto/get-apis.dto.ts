import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from 'src/commons/dto/query.dto';
import { Api } from '../entities/api.entity';

export class GetApisDto extends IntersectionType(PartialType(Api), QueryDto) {}

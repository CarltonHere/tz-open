import { IntersectionType } from '@nestjs/swagger';
import { QueryDto, QueryPartialType } from 'src/commons/dto/query.dto';
import { ApiKey } from '../entities/api-key.entity';

export class GetApiKeysDto extends IntersectionType(
  QueryPartialType(ApiKey),
  QueryDto,
) {}

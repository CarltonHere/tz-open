import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from 'src/commons/dto/query.dto';
import { ApiKey } from '../entities/api-key.entity';

export class GetApiKeysDto extends IntersectionType(
  PartialType(ApiKey),
  QueryDto,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { QueryDto, QueryPartialType } from 'src/commons/dto/query.dto';
import { Api } from '../entities/api.entity';

export class GetApisDto extends IntersectionType(
  QueryPartialType(Api),
  QueryDto,
) {}

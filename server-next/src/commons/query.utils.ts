import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Like,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { CommonApiResponse } from './dto/api.response';
import { QueryDto } from './dto/query.dto';

export type CriteriaOrWhereOptions<T> = string | FindOptionsWhere<T>;

export async function entityFindAllByPaging<Entity extends ObjectLiteral = any>(
  repository: Repository<Entity>,
  findManyOptions?: FindManyOptions<Entity> & QueryDto,
) {
  const {
    current = 1,
    pageSize = 10,
    select,
    relations,
    order,
    ...filter
  } = findManyOptions || {};
  if (filter) {
    for (const k in filter) {
      if (filter[k]) {
        if (Array.isArray(filter[k])) {
          if (String(k).includes('time')) {
            filter[k] = Between(filter[k][0], filter[k][1]);
          } else {
            filter[k] = In(filter[k]);
          }
        }
        // 判断是否是字符串
        if (typeof filter[k] === 'string') {
          filter[k] = Like(filter[k]);
        }
      } else {
        filter[k] = undefined;
      }
    }
  }

  const [data, total] = await repository.findAndCount({
    select,
    relations,
    order,
    where: filter,
    take: Math.min(pageSize, 100),
    skip: (current - 1) * Math.min(pageSize, 100),
  } as FindManyOptions<Entity>);
  return new CommonApiResponse({ data, current, pageSize, total });
}

import * as _ from 'lodash';
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
  findManyOptions?: FindManyOptions<Entity> & {
    filter?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
  } & QueryDto,
) {
  const { current = 1, pageSize = 10, filter } = findManyOptions || {};
  if (findManyOptions?.filter && filter) {
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const k in findManyOptions.filter) {
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
    ..._.omit(findManyOptions, 'filter'),
    where: filter,
    take: Math.min(pageSize, 100),
    skip: (current - 1) * Math.min(pageSize, 100),
  } as FindManyOptions<Entity>);
  return new CommonApiResponse({ data, current, pageSize, total });
}

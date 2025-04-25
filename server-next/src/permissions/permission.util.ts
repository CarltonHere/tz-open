import { PrimaryMetaData } from 'src/users/user.decorator';
import { Equal, FindOptionsWhere, IsNull, Or } from 'typeorm';
import { PERMISSION_STRATEGY } from './entities/permission.entity';

export function injectPrimaryMetaData<T>(
  query: T,
  primaryMetaData: PrimaryMetaData,
  ownerKey: string = 'owner',
) {
  if (primaryMetaData.type === PERMISSION_STRATEGY.GLOBAL) return query;
  if (!query) query = {} as T;
  if (Array.isArray(query)) {
    query.forEach((item: FindOptionsWhere<any>) => {
      item[ownerKey] = Or(Equal(primaryMetaData.user.id), IsNull());
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (query as any)[ownerKey] = Or(Equal(primaryMetaData.user.id), IsNull());
  }

  return query;
}

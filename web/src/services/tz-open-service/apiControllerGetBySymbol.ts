// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/${param0} */
export async function apiControllerGetBySymbol(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApiControllerGetBySymbolParams,
  options?: { [key: string]: any },
) {
  const { symbol: param0, ...queryParams } = params;
  return request<any>(`/api/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

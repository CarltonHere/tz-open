// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /open/${param1}/${param0} */
export async function openControllerProxyPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPutParams,
  options?: { [key: string]: any },
) {
  const { apiUrl: param0, apiName: param1, ...queryParams } = params;
  return request<any>(`/open/${param1}/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /origin/${param1}/${param0} */
export async function openControllerProxyPut2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPutParams,
  options?: { [key: string]: any },
) {
  const { apiUrl: param0, apiName: param1, ...queryParams } = params;
  return request<any>(`/origin/${param1}/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

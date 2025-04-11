// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api-keys */
export async function apiKeysControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApiKeysControllerFindAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api-keys', {
    method: 'GET',
    params: {
      ...params,
      order: undefined,
      ...params['order'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api-keys */
export async function apiKeysControllerCreate(
  body: API.CreateApiKeyDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api-keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api-keys/${param0} */
export async function apiKeysControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApiKeysControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api-keys/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api-keys/${param0} */
export async function apiKeysControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApiKeysControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api-keys/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /api-keys/${param0} */
export async function apiKeysControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApiKeysControllerUpdateParams,
  body: API.ApiKey,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api-keys/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

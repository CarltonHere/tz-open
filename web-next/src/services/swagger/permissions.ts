// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /permissions */
export async function permissionsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PermissionsControllerFindAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/permissions', {
    method: 'GET',
    params: {
      ...params,
      order: undefined,
      ...params['order'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /permissions */
export async function permissionsControllerCreate(
  body: API.Permission,
  options?: { [key: string]: any },
) {
  return request<any>('/permissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /permissions/${param0} */
export async function permissionsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PermissionsControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/permissions/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /permissions/${param0} */
export async function permissionsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PermissionsControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/permissions/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /permissions/${param0} */
export async function permissionsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PermissionsControllerUpdateParams,
  body: API.Permission,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/permissions/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /permissions/service */
export async function permissionsControllerFindAllServices(options?: { [key: string]: any }) {
  return request<any>('/permissions/service', {
    method: 'GET',
    ...(options || {}),
  });
}

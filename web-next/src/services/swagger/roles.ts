// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /roles */
export async function rolesControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RolesControllerFindAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/roles', {
    method: 'GET',
    params: {
      ...params,
      order: undefined,
      ...params['order'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /roles */
export async function rolesControllerCreate(body: API.Role, options?: { [key: string]: any }) {
  return request<any>('/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /roles/${param0} */
export async function rolesControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RolesControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/roles/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /roles/${param0} */
export async function rolesControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RolesControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/roles/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /roles/${param0} */
export async function rolesControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RolesControllerUpdateParams,
  body: API.Role,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/roles/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

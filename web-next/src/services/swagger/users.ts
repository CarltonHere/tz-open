// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /users */
export async function usersControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UsersControllerFindAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/users', {
    method: 'GET',
    params: {
      ...params,
      'filter[role]': undefined,
      ...params['filter[role]'],
      order: undefined,
      ...params['order'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /users */
export async function usersControllerCreate(
  body: API.CreateUserDto,
  options?: { [key: string]: any },
) {
  return request<any>('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /users/${param0} */
export async function usersControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UsersControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /users/${param0} */
export async function usersControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UsersControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /users/${param0} */
export async function usersControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UsersControllerUpdateParams,
  body: API.UpdateUsersDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/users/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /users/current */
export async function usersControllerFindCurrent(options?: { [key: string]: any }) {
  return request<any>('/users/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /users/current */
export async function usersControllerUpdateCurrent(
  body: API.UpdateUsersDto,
  options?: { [key: string]: any },
) {
  return request<any>('/users/current', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

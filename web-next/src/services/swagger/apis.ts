// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /apis */
export async function apisControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApisControllerFindAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/apis', {
    method: 'GET',
    params: {
      ...params,
      order: undefined,
      ...params['order'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /apis */
export async function apisControllerCreate(
  body: API.CreateApiDto,
  options?: { [key: string]: any },
) {
  return request<any>('/apis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /apis/${param0} */
export async function apisControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApisControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/apis/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /apis/${param0} */
export async function apisControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApisControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/apis/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /apis/${param0} */
export async function apisControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ApisControllerUpdateParams,
  body: API.UpdateApiDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/apis/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

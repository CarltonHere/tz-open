// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /open */
export async function openControllerFindAll0(options?: { [key: string]: any }) {
  return request<any>('/open', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /open */
export async function openControllerCreate0(
  body: API.CreateOpenDto,
  options?: { [key: string]: any },
) {
  return request<any>('/open', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /open/${param0} */
export async function openControllerFindOne0(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerFindOne0Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/open/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /open/${param0} */
export async function openControllerRemove0(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerRemove0Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/open/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /open/${param0} */
export async function openControllerUpdate0(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerUpdate0Params,
  body: API.UpdateOpenDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/open/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /open/${param0}/${param1} */
export async function openControllerProxyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyGetParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/open/${param0}/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /open/${param0}/${param1} */
export async function openControllerProxyPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPutParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/open/${param0}/${param1}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /open/${param0}/${param1} */
export async function openControllerProxyPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPostParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/open/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /open/${param0}/${param1} */
export async function openControllerProxyDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyDeleteParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/open/${param0}/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /open/${param0}/${param1} */
export async function openControllerProxyPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPatchParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/open/${param0}/${param1}`, {
    method: 'PATCH',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /origin */
export async function openControllerFindAll1(options?: { [key: string]: any }) {
  return request<any>('/origin', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /origin */
export async function openControllerCreate1(
  body: API.CreateOpenDto,
  options?: { [key: string]: any },
) {
  return request<any>('/origin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /origin/${param0} */
export async function openControllerFindOne1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerFindOne1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/origin/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /origin/${param0} */
export async function openControllerRemove1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerRemove1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/origin/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /origin/${param0} */
export async function openControllerUpdate1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerUpdate1Params,
  body: API.UpdateOpenDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/origin/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /origin/${param0}/${param1} */
export async function openControllerProxyGet2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyGetParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/origin/${param0}/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /origin/${param0}/${param1} */
export async function openControllerProxyPut2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPutParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/origin/${param0}/${param1}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /origin/${param0}/${param1} */
export async function openControllerProxyPost2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPostParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/origin/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /origin/${param0}/${param1} */
export async function openControllerProxyDelete2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyDeleteParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/origin/${param0}/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /origin/${param0}/${param1} */
export async function openControllerProxyPatch2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.OpenControllerProxyPatchParams,
  options?: { [key: string]: any },
) {
  const { apiName: param0, path: param1, ...queryParams } = params;
  return request<any>(`/origin/${param0}/${param1}`, {
    method: 'PATCH',
    params: { ...queryParams },
    ...(options || {}),
  });
}

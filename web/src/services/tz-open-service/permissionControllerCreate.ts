// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /permission */
export async function permissionControllerCreate(
  body: API.CreatePermissionDto,
  options?: { [key: string]: any },
) {
  return request<any>('/permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

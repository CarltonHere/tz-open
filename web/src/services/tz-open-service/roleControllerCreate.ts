// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /role */
export async function roleControllerCreate(
  body: API.CreateRoleDto,
  options?: { [key: string]: any },
) {
  return request<any>('/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

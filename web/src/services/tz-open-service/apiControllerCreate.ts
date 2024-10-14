// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api */
export async function apiControllerCreate(
  body: API.CreateApiDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

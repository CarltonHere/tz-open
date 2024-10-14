// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api-key */
export async function apiKeyControllerCreate(
  body: API.CreateApiKeyDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

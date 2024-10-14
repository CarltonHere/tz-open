// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api-key */
export async function apiKeyControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/api-key', {
    method: 'GET',
    ...(options || {}),
  });
}

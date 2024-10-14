// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api */
export async function apiControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/api', {
    method: 'GET',
    ...(options || {}),
  });
}

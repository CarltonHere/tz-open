// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /role */
export async function roleControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/role', {
    method: 'GET',
    ...(options || {}),
  });
}

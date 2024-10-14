// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /permission */
export async function permissionControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/permission', {
    method: 'GET',
    ...(options || {}),
  });
}

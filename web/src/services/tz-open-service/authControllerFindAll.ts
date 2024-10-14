// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /auth */
export async function authControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/auth', {
    method: 'GET',
    ...(options || {}),
  });
}

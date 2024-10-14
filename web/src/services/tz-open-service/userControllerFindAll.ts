// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /user */
export async function userControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/user', {
    method: 'GET',
    ...(options || {}),
  });
}

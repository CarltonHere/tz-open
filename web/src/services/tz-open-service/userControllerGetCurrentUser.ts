// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /user/current */
export async function userControllerGetCurrentUser(options?: { [key: string]: any }) {
  return request<any>('/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

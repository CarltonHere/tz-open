// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /open */
export async function openControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/open', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /origin */
export async function openControllerFindAll2(options?: { [key: string]: any }) {
  return request<any>('/origin', {
    method: 'GET',
    ...(options || {}),
  });
}

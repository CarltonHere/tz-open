// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /balance/current */
export async function balanceControllerGetCurrentUserBalance(options?: { [key: string]: any }) {
  return request<any>('/balance/current', {
    method: 'GET',
    ...(options || {}),
  });
}

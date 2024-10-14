// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /balance */
export async function balanceControllerCreate(
  body: API.CreateBalanceDto,
  options?: { [key: string]: any },
) {
  return request<any>('/balance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

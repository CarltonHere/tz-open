// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /user */
export async function userControllerCreate(
  body: API.CreateUserDto,
  options?: { [key: string]: any },
) {
  return request<any>('/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

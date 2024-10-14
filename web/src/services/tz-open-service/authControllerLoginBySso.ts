// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /auth/sso */
export async function authControllerLoginBySso(
  body: API.LoginByPasswordDto,
  options?: { [key: string]: any },
) {
  return request<any>('/auth/sso', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

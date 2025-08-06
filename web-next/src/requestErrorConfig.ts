import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (error?.response?.data?.errorCode && error?.response?.data?.errorMessage) {
          const {
            errorCode,
            errorMessage,
            showType = ErrorShowType.ERROR_MESSAGE,
          } = error?.response?.data as unknown as ResponseStructure;
          // 判断如果错误码为 401，则跳转到登录页
          if (errorCode === 401) {
            localStorage.removeItem('Authentication');
            message.error(errorMessage);
            if (!history.location.pathname.startsWith('/user/login')) {
              history.push('/user/login');
            }
            return;
          }
          switch (showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        } else {
          // 不是标准的错误返回体
          message.error(`Response status:${error.response.status}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('Authentication');
      // 拦截请求配置，进行个性化处理。
      // 如果是登录接口，则不需要添加 Authorization 头
      if (!config.url?.includes('/auth')) {
        config.headers = {
          ...config.headers,
          Authorization: token ? `Bearer ${token}` : '',
        };
      }

      // 返回处理好的 config
      return config;
    },
  ],
};

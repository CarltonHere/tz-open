import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { notification } from 'antd';

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
  data: any;
  code: number;
  message: string;
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
    // 错误抛出
    errorThrower: (res) => {
      const { data, code, message, showType } = res as unknown as ResponseStructure;
      console.log('code', data);
      if (code !== 200) {
        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = { code, message, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const { info } = error;
        const { message } = info;
        notification.error({
          message: '出错噜~',
          description: `${message}`,
        });
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // 判断服务器是否返回错误信息
        if (error?.response?.data?.message) {
          notification.error({
            message: '出错噜~',
            description: error?.response?.data?.message,
          });
        } else {
          notification.error({
            message: '出错噜~',
            description: `Response status:${error.response.status}`,
          });
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        notification.error({
          message: '服务器睡着了~',
          description: `服务器无响应，请稍后再试`,
        });
      } else {
        // 发送请求时出了点问题
        notification.error({
          message: '出错辣~',
          description: `意料之外的错误，请联系管理员`,
        });
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('_token');
      // 拦截请求配置，进行个性化处理。
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      // 返回处理好的 config
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      if (data) {
        return data;
      } else {
        // 抛出自制的错误
        const error: any = new Error('服务器返回数据异常');
        error.name = 'BizError';
        error.info = { code: 500, message: '服务器故障，请联系管理员', data };
        throw error;
      }
    },
  ],
};

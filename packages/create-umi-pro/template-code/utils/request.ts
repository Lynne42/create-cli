import type { RequestConfig } from 'umi';
import { message } from 'antd';
import requestConfig from '../../config/request.prefix';

const { devPrefix = '', prodPrefix = '' } = requestConfig;
const prefix = process.env.NODE_ENV === 'development' ? devPrefix : prodPrefix;

const headers = {
  // 'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  'X-Requested-With': 'XMLHttpRequest',
};

// 需要单独处理的错误类型
const errorShowType: { [key: number]: string } = {
  1: 'error1',
  2: 'error2',
  3: 'error3',
};

// 接口响应数据格式
interface ResponseStructure {
  data: any;
  code: number;
  message?: string;
}

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorThrower: (res: ResponseStructure) => {
      const { data, code, message } = res;
      if (errorShowType[code]) {
        const error: { [key: string]: any } = new Error(message);
        error.name = 'BizError';
        error.info = { code, message, data };
        throw error; // 自定义错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 自定义的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { message, code } = errorInfo;
          switch (errorInfo.code) {
            case 1:
              // do nothing
              break;

            default:
            // message.error(message);
          }
        }
      } else if (error.response) {
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 拦截请求配置，进行个性化处理。
      let tranUrl = config.url;
      const reg = /^\/@(\w+)\//;
      tranUrl = tranUrl.match(reg)
        ? tranUrl.replace(reg, '/$1/')
        : `${prefix}${tranUrl}`;
      return {
        ...config,
        headers: {
          ...headers,
          ...(config.headers || {}),
        },
        url: tranUrl,
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      const { data } = response;
      if (data.code !== 0) {
        return {
            ...data,
            status: response.status,
        }
      }
      return response.data;
    },
  ],
};

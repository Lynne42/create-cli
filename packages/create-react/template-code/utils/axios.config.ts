import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";

const axiosCancelToken = axios.CancelToken;

// 设置超时时间
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export interface ResponseData {
    code: number;
    data?: any;
    msg: string;
}

interface PendingType {
    [propsName: string]: any;
}

class AxiosRequest {
    private static requestInstance = new AxiosRequest();

    private pending: PendingType = {};

    private isRefreshingToken: boolean = false;

    private subscribersRequestList: Function[] = [];

    private constructor() {}

    public request(options: AxiosRequestConfig): AxiosPromise {
        console.log("options", options);
        const instance: AxiosInstance = axios.create();

        this.interceptors(instance);
        return instance(options);
    }

    private interceptors(instance: AxiosInstance) {
        instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                let requestIdentify = this.getRequestIdentify(config, true);

                this.removePending(requestIdentify, true);

                config.cancelToken = new axiosCancelToken((c) => {
                    this.pending[requestIdentify] = c;
                });
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            (response: AxiosResponse) => {
                let requestIdentify = this.getRequestIdentify(response.config);
                this.removePending(requestIdentify);

                const { data } = response;
                const { code, msg } = data;

                this.isRefreshingToken = false;
                console.log("axios", data);
                if (code !== 0) {
                    // response 2xx, code !== 0  错误处理函数
                    return Promise.reject({ code, msg });
                }
                return response.data.data;
            },
            (error) => {
                if (error.response) {
                    return Promise.reject(error.response);
                } else if (error.request) {
                    return Promise.reject(error.request);
                } else {
                    return Promise.reject(error.message);
                }
            }
        );
    }

    private getRequestIdentify = (config: AxiosRequestConfig, isRequest: boolean = false) => {
        let url = config.url || "";
        const method = config.method || "get";
        let data = null;
        if (config.method === "get") {
            data = config.params;
        } else {
            data = config.data;
        }
        return encodeURIComponent(url + method + JSON.stringify(data || ""));
    };

    private removePending = (key: string, isRequest: boolean = false) => {
        if (this.pending[key] && isRequest) {
            this.pending[key]("取消重复请求");
        }
        delete this.pending[key];
    };

    private addSubscriberRequestList(listener: any) {
        this.subscribersRequestList.push(listener);
    }

    public static getInstance() {
        return AxiosRequest.requestInstance;
    }
}

const requestInstance = AxiosRequest.getInstance();

export default requestInstance;

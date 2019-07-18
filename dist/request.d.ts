interface IRequestOptions {
    headers: Object;
    path: string;
    data: string;
    method: Method;
}
export declare type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
export declare function request({ method, headers, path, data }: IRequestOptions): Promise<import("axios").AxiosResponse<any>>;
export {};

import { IProvider } from './IProvider';
export interface ICloudflareOptions {
    throttle: number;
}
export declare class Cloudflare implements IProvider {
    base: string;
    nextRequestId: number;
    options: ICloudflareOptions;
    makeRequest: (options: any) => Promise<any>;
    constructor(options?: ICloudflareOptions);
    getBlockNumber(): Promise<number>;
    getErc20Balance(contract: string, address: string): Promise<number>;
    getBlock(block: number, includeTransactionObjects?: boolean): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
    _makeRequest(data: any): Promise<import("axios").AxiosResponse<any>>;
}

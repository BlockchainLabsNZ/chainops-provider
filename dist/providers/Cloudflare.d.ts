import { IProvider } from './IProvider';
export declare class Cloudflare implements IProvider {
    base: string;
    constructor(key: string);
    getBlockNumber(): Promise<number>;
    getBlock(block: number): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
    makeRequest(data: any): Promise<import("axios").AxiosResponse<any>>;
}

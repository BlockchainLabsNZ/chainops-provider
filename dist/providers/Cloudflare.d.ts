import { IProvider } from './IProvider';
export declare class Cloudflare implements IProvider {
    base: string;
    nextRequestId: number;
    constructor();
    getBlockNumber(): Promise<number>;
    getErc20Balance(contract: string, address: string): Promise<number>;
    getBlock(block: number): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
    makeRequest(data: any): Promise<import("axios").AxiosResponse<any>>;
}

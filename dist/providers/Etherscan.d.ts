import { IProvider } from './IProvider';
export declare class Etherscan implements IProvider {
    key: string;
    base: string;
    constructor(key: string);
    getBlockNumber(): Promise<number>;
    getBlock(number: number, includeTransactionObject?: boolean): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
    makeRequest(qsParameters: Object, data: any): Promise<import("axios").AxiosResponse<any>>;
    getErc20Balance(contract: string, address: string): Promise<any>;
}

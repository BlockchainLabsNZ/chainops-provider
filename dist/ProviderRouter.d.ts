import { IProvider } from './providers/IProvider';
interface IOptions {
    routing: {
        [methodName: string]: string[];
    };
    providers: {
        [name: string]: IProvider;
    };
}
declare type SupportedMethods = 'getBlockNumber' | 'getTransaction' | 'getTransactionReceipt' | 'getBlock';
export declare class ProviderRouter {
    configuration: any;
    constructor(options: IOptions);
    runMethod(methodName: SupportedMethods, ...args: any): Promise<any>;
    getBlockNumber(): Promise<any>;
    getBlock(number: number): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
}
export {};

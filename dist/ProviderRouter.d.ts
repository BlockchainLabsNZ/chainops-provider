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
    stats: {
        [provider: string]: {
            [methodName: string]: {
                [priority: number]: number;
            };
        };
    };
    constructor(options: IOptions);
    incrementStats(provider: string, method: string, priority: number): void;
    runMethod(methodName: SupportedMethods, ...args: any): Promise<any>;
    getBlockNumber(): Promise<any>;
    getBlock(number: number): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
}
export {};

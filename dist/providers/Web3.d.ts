import Web3 from 'web3';
import { IProvider } from './IProvider';
declare type Web3Call<T> = () => Promise<T>;
export declare class WebThree implements IProvider {
    web3: Web3;
    _web3ConnectionErrorHandler?: <T>(err: Error, call: Web3Call<T>) => any;
    constructor(web3: Web3);
    getBlockNumber(): Promise<number>;
    getBlock(blockNumber: number, returnTransactionObjects?: boolean): Promise<import("web3-eth").Block>;
    getTransaction(txHash: string): Promise<import("web3-core").Transaction>;
    getTransactionReceipt(txHash: string): Promise<import("web3-core").TransactionReceipt>;
    getErc20Balance(contractAddress: string, holdingAddress: string): Promise<number>;
    waitForWeb3Connection(waitSeconds: number): Promise<void | {}>;
    isWeb3Ready(): Promise<void>;
    disconnect(): Promise<void>;
    _wrapWeb3Call<T>(call: Web3Call<T>): Promise<T>;
    attachConnectionErrorHandler(handler: any): void;
}
export {};

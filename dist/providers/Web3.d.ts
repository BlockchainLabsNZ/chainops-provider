import Web3 from 'web3';
import { IProvider } from './IProvider';
export declare class WebThree implements IProvider {
    web3: Web3;
    constructor(web3: Web3);
    getBlockNumber(): Promise<number>;
    getBlock(blockNumber: number): Promise<import("web3-eth").Block>;
    getTransaction(txHash: string): Promise<import("web3-core").Transaction>;
    getTransactionReceipt(txHash: string): Promise<import("web3-core").TransactionReceipt>;
    getErc20Balance(contractAddress: string, holdingAddress: string): Promise<number>;
}

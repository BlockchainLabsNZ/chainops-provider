import { EthClient } from '../lib/ethercast-eth-jsonrpc-client/src/index';
import { IProvider } from './IProvider';
import { Block } from 'web3-eth';
export declare class JsonRpc implements IProvider {
    client: EthClient | undefined;
    connectionString: string;
    constructor(connectionString: string);
    init(): Promise<void>;
    getBlockNumber(): Promise<number>;
    getTransactionReceipt(txHash: string): Promise<import("../lib/ethercast-eth-jsonrpc-client/node_modules/@ethercast/model/build/main/lib/types").TransactionReceipt>;
    getBlock(blockNumber: number): Promise<Block>;
    getErc20Balance(contract: string, address: string): Promise<number>;
    getTransaction(txHash: string): Promise<any>;
}

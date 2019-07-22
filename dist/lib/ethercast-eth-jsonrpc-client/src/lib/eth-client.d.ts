import { BlockWithFullTransactions, BlockWithTransactionHashes, Log, Transaction, TransactionReceipt } from '@ethercast/model';
import BigNumber from 'bignumber.js';
import { Method } from './json-rpc-methods';
import { MethodParameter, MethodParameterObject } from './util';
export declare type NumberLike = string | number | BigNumber;
export declare type BlockParameter = NumberLike | 'earliest' | 'latest' | 'pending';
export interface LogFilter extends MethodParameterObject {
    topics?: Array<string | string[]>;
    fromBlock: BlockParameter;
    toBlock: BlockParameter;
    address?: string;
}
export interface SendTransactionParameters extends MethodParameterObject {
    from: string;
    to?: string;
    gas?: NumberLike;
    gasPrice?: NumberLike;
    value?: NumberLike;
    data?: string;
    nonce?: NumberLike;
}
/**
 * This is the interface exposed by all the implementations of the clients
 */
export default interface EthClient {
    net_version(): Promise<number>;
    web3_clientVersion(): Promise<string>;
    eth_getBlockByHash(hash: string, includeFullTransactions: false): Promise<BlockWithTransactionHashes>;
    eth_getBlockByHash(hash: string, includeFullTransactions: true): Promise<BlockWithFullTransactions>;
    eth_getBlockByNumber(blockNumber: BlockParameter, includeFullTransactions: false): Promise<BlockWithTransactionHashes>;
    eth_getBlockByNumber(blockNumber: BlockParameter, includeFullTransactions: true): Promise<BlockWithFullTransactions>;
    eth_blockNumber(): Promise<BigNumber>;
    eth_getLogs(filter: LogFilter): Promise<Log[]>;
    eth_getTransaction(hash: string): Promise<Transaction>;
    eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt>;
    eth_getTransactionReceipts(hashes: string[]): Promise<TransactionReceipt[]>;
    eth_sendTransaction(params: SendTransactionParameters): Promise<string>;
    cmd<TResponse>(method: Method, ...params: MethodParameter[]): Promise<TResponse>;
}

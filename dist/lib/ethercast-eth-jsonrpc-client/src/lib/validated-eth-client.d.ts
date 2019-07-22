import { BlockWithFullTransactions, BlockWithTransactionHashes, Log, Transaction, TransactionReceipt } from '@ethercast/model';
import BigNumber from 'bignumber.js';
import EthClient, { BlockParameter, LogFilter, SendTransactionParameters } from './eth-client';
import { Method } from './json-rpc-methods';
import { MethodParameter } from './util';
export default class ValidatedEthClient implements EthClient {
    private client;
    constructor(client: EthClient);
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

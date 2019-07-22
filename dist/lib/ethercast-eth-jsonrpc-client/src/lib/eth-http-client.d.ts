import { BlockWithFullTransactions, BlockWithTransactionHashes, Log, TransactionReceipt, Transaction } from '@ethercast/model';
import BigNumber from 'bignumber.js';
import EthClient, { BlockParameter, LogFilter, SendTransactionParameters } from './eth-client';
import { Method } from './json-rpc-methods';
import { MethodParameter } from './util';
/**
 * This client interacts with the JSON RPC via HTTP/HTTPS
 */
export default class EthHTTPClient implements EthClient {
    private readonly endpointUrl;
    private nextRequestId;
    constructor({ endpointUrl }: {
        endpointUrl: string;
    });
    eth_getBlockByHash(hash: string, includeFullTransactions: false): Promise<BlockWithTransactionHashes>;
    eth_getBlockByHash(hash: string, includeFullTransactions: true): Promise<BlockWithFullTransactions>;
    eth_getBlockByNumber(blockNumber: BlockParameter, includeFullTransactions: false): Promise<BlockWithTransactionHashes>;
    eth_getBlockByNumber(blockNumber: BlockParameter, includeFullTransactions: true): Promise<BlockWithFullTransactions>;
    net_version(): Promise<number>;
    web3_clientVersion: () => Promise<string>;
    eth_blockNumber: () => Promise<BigNumber>;
    eth_getLogs: (filter: LogFilter) => Promise<Log[]>;
    eth_getTransaction(hash: string): Promise<Transaction>;
    eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt>;
    eth_getTransactionReceipts(hashes: string[]): Promise<TransactionReceipt[]>;
    eth_sendTransaction(params: SendTransactionParameters): Promise<string>;
    cmd<TResponse>(method: Method, ...params: MethodParameter[]): Promise<TResponse>;
    private rpc;
}

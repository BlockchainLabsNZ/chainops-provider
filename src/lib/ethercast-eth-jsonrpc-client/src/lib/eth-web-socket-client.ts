import {
  BlockWithFullTransactions,
  BlockWithTransactionHashes,
  TransactionReceipt,
  Transaction
} from '@ethercast/model';
import BigNumber from 'bignumber.js';
import EthClient, {
  BlockParameter,
  LogFilter,
  SendTransactionParameters
} from './eth-client';
import { Method } from './json-rpc-methods';
import { buildRequest, MethodParameter } from './util';

import WebSocket from 'isomorphic-ws';

/**
 * This client interacts with the JSON RPC via a WebSocket connection
 */
export default class EthWebSocketClient implements EthClient {
  public static Connect(
    nodeUrl: string,
    timeoutMs: number = 5000
  ): Promise<EthWebSocketClient> {
    return new Promise<EthWebSocketClient>((resolve, reject) => {
      try {
        const ws = new WebSocket(nodeUrl);

        const timer = setTimeout(() => {
          reject(new Error(`connection open timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        // when the connection opens, we're ready to send requests
        ws.on('open', () => {
          clearTimeout(timer);
          resolve(new EthWebSocketClient({ ws }));
        });

        ws.on('error', err => {
          clearTimeout(timer);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private readonly ws: WebSocket;
  private nextRequestId: number = 1;

  constructor({ ws }: { ws: WebSocket }) {
    this.ws = ws;
  }

  public web3_clientVersion = () => this.cmd<string>(Method.web3_clientVersion);

  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;
  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: boolean
  ): any {
    return this.cmd<
      BlockWithFullTransactions | BlockWithTransactionHashes | null
    >(Method.eth_getBlockByHash, hash, includeFullTransactions).then(block => {
      if (block === null) {
        throw new Error('block by number does not exist');
      }

      return Promise.resolve(block as BlockWithTransactionHashes);
    });
  }

  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;
  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: boolean
  ): any {
    return this.cmd<
      BlockWithFullTransactions | BlockWithTransactionHashes | null
    >(Method.eth_getBlockByNumber, blockNumber, includeFullTransactions).then(
      block => {
        if (block === null) {
          throw new Error('block by number does not exist');
        }

        return Promise.resolve(block as BlockWithFullTransactions);
      }
    );
  }

  public eth_blockNumber = () =>
    this.cmd<string>(Method.eth_blockNumber).then(s => new BigNumber(s));

  public eth_getLogs = (filter: LogFilter) =>
    this.cmd<any>(Method.eth_getLogs, filter);

  public net_version(): Promise<number> {
    return this.cmd<string>(Method.net_version).then(s => parseInt(s, 10));
  }

  public eth_getTransaction(hash: string): Promise<Transaction> {
    return this.cmd<Transaction>(Method.eth_getTransactionByHash, hash);
  }

  public eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    return this.cmd<TransactionReceipt>(Method.eth_getTransactionReceipt, hash);
  }

  public async eth_getTransactionReceipts(
    hashes: string[]
  ): Promise<TransactionReceipt[]> {
    if (hashes.length === 0) {
      return [];
    }

    // this is cheaper over websockets
    return Promise.all(hashes.map(h => this.eth_getTransactionReceipt(h)));
  }

  public eth_sendTransaction(
    params: SendTransactionParameters
  ): Promise<string> {
    return this.cmd<string>(Method.eth_sendTransaction, params);
  }

  public async cmd<TResponse>(
    method: Method,
    ...params: MethodParameter[]
  ): Promise<TResponse> {
    if (this.ws.readyState !== this.ws.OPEN) {
      throw new Error('websocket is not open!');
    }

    return new Promise<any>((resolve, reject) => {
      const request = buildRequest(this.nextRequestId++, method, params);

      let resolved = false;

      const listener = (event: {
        data: any;
        type: string;
        target: WebSocket;
      }) => {
        if (event.type === 'message') {
          try {
            const msgData = JSON.parse(event.data);

            if (msgData.id === request.id) {
              resolve(msgData.result);
              resolved = true;
              this.ws.removeEventListener('message', listener);
            }
          } catch (error) {
            reject(`failed to parse message response: ${event.data}`);
          }
        }
      };

      this.ws.addEventListener('message', listener);

      this.ws.send(JSON.stringify(request));

      setTimeout(() => {
        if (!resolved) {
          this.ws.removeEventListener('message', listener);
          reject(new Error('request timed out'));
        }
      }, 5000);
    });
  }
}

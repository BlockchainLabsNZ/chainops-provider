"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const json_rpc_methods_1 = require("./json-rpc-methods");
const util_1 = require("./util");
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
/**
 * This client interacts with the JSON RPC via a WebSocket connection
 */
class EthWebSocketClient {
    constructor({ ws }) {
        this.nextRequestId = 1;
        this.web3_clientVersion = () => this.cmd(json_rpc_methods_1.Method.web3_clientVersion);
        this.eth_blockNumber = () => this.cmd(json_rpc_methods_1.Method.eth_blockNumber).then(s => new bignumber_js_1.default(s));
        this.eth_getLogs = (filter) => this.cmd(json_rpc_methods_1.Method.eth_getLogs, filter);
        this.ws = ws;
    }
    static Connect(nodeUrl, timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            try {
                const ws = new isomorphic_ws_1.default(nodeUrl);
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
            }
            catch (err) {
                reject(err);
            }
        });
    }
    eth_getBlockByHash(hash, includeFullTransactions) {
        return this.cmd(json_rpc_methods_1.Method.eth_getBlockByHash, hash, includeFullTransactions).then(block => {
            if (block === null) {
                throw new Error('block by number does not exist');
            }
            return Promise.resolve(block);
        });
    }
    eth_getBlockByNumber(blockNumber, includeFullTransactions) {
        return this.cmd(json_rpc_methods_1.Method.eth_getBlockByNumber, blockNumber, includeFullTransactions).then(block => {
            if (block === null) {
                throw new Error('block by number does not exist');
            }
            return Promise.resolve(block);
        });
    }
    net_version() {
        return this.cmd(json_rpc_methods_1.Method.net_version).then(s => parseInt(s, 10));
    }
    eth_getTransaction(hash) {
        return this.cmd(json_rpc_methods_1.Method.eth_getTransactionByHash, hash);
    }
    eth_getTransactionReceipt(hash) {
        return this.cmd(json_rpc_methods_1.Method.eth_getTransactionReceipt, hash);
    }
    eth_getTransactionReceipts(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hashes.length === 0) {
                return [];
            }
            // this is cheaper over websockets
            return Promise.all(hashes.map(h => this.eth_getTransactionReceipt(h)));
        });
    }
    eth_sendTransaction(params) {
        return this.cmd(json_rpc_methods_1.Method.eth_sendTransaction, params);
    }
    cmd(method, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws.readyState !== this.ws.OPEN) {
                throw new Error('websocket is not open!');
            }
            return new Promise((resolve, reject) => {
                const request = util_1.buildRequest(this.nextRequestId++, method, params);
                let resolved = false;
                const listener = (event) => {
                    if (event.type === 'message') {
                        try {
                            const msgData = JSON.parse(event.data);
                            if (msgData.id === request.id) {
                                resolve(msgData.result);
                                resolved = true;
                                this.ws.removeEventListener('message', listener);
                            }
                        }
                        catch (error) {
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
        });
    }
}
exports.default = EthWebSocketClient;

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
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const json_rpc_methods_1 = require("./json-rpc-methods");
const util_1 = require("./util");
/**
 * This client interacts with the JSON RPC via HTTP/HTTPS
 */
class EthHTTPClient {
    constructor({ endpointUrl }) {
        this.nextRequestId = 1;
        this.web3_clientVersion = () => this.cmd(json_rpc_methods_1.Method.web3_clientVersion);
        this.eth_blockNumber = () => this.cmd(json_rpc_methods_1.Method.eth_blockNumber).then(s => new bignumber_js_1.default(s));
        this.eth_getLogs = (filter) => this.cmd(json_rpc_methods_1.Method.eth_getLogs, filter);
        this.endpointUrl = endpointUrl;
    }
    eth_getBlockByHash(hash, includeFullTransactions) {
        return this.cmd(json_rpc_methods_1.Method.eth_getBlockByHash, hash, includeFullTransactions).then(block => {
            if (block === null) {
                throw new Error(`block by hash does not exist: ${hash}`);
            }
            return block;
        });
    }
    eth_getBlockByNumber(blockNumber, includeFullTransactions) {
        return this.cmd(json_rpc_methods_1.Method.eth_getBlockByNumber, blockNumber, includeFullTransactions).then(block => {
            if (block === null) {
                throw new Error(`block by number does not exist: ${blockNumber}`);
            }
            return block;
        });
    }
    net_version() {
        return this.cmd(json_rpc_methods_1.Method.net_version).then(s => parseInt(s, 10));
    }
    eth_getTransaction(hash) {
        return this.cmd(json_rpc_methods_1.Method.eth_getTransactionByHash, hash).then(tx => {
            if (tx === null) {
                throw new Error('invalid transaction hash');
            }
            return tx;
        });
    }
    eth_getTransactionReceipt(hash) {
        return this.cmd(json_rpc_methods_1.Method.eth_getTransactionReceipt, hash).then(receipt => {
            if (receipt === null) {
                throw new Error('invalid transaction hash');
            }
            return receipt;
        });
    }
    eth_getTransactionReceipts(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hashes.length === 0) {
                return [];
            }
            const results = yield this.rpc(hashes.map(hash => util_1.buildRequest(this.nextRequestId++, json_rpc_methods_1.Method.eth_getTransactionReceipt, [
                hash
            ])));
            return results.map(({ result }) => {
                if (typeof result === 'undefined') {
                    throw new Error('invalid response: ' + JSON.stringify(result));
                }
                if (result === null) {
                    throw new Error('invalid transaction hash');
                }
                return result;
            });
        });
    }
    eth_sendTransaction(params) {
        return this.cmd(json_rpc_methods_1.Method.eth_sendTransaction, params);
    }
    cmd(method, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = util_1.buildRequest(this.nextRequestId++, method, params);
            const json = yield this.rpc(request);
            if (typeof json.error !== 'undefined') {
                throw new Error(`json rpc threw error code ${json.error.code}: ${json.error.message}`);
            }
            if (typeof json.result === 'undefined') {
                throw new Error(`failed to fetch: no 'result' key found in the body: ${JSON.stringify(json)}`);
            }
            return json.result;
        });
    }
    rpc(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield cross_fetch_1.default(this.endpointUrl, {
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            let bodyText;
            try {
                bodyText = yield response.text();
            }
            catch (err) {
                throw new Error(`failed to extract body text from response: ${err.message}`);
            }
            if (response.status !== 200) {
                throw new Error(`failed to fetch: expected http 200 status but got ${response.status} with text "${bodyText}"`);
            }
            let json;
            try {
                json = JSON.parse(bodyText);
            }
            catch (err) {
                throw new Error(`body text "${bodyText}" was not valid json: ${err.message}`);
            }
            return json;
        });
    }
}
exports.default = EthHTTPClient;

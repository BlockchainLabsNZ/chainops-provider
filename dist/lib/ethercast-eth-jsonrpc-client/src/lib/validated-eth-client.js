"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("@ethercast/model");
class ValidatedEthClient {
    constructor(client) {
        this.client = client;
    }
    net_version() {
        return this.client.net_version();
    }
    web3_clientVersion() {
        return this.client.web3_clientVersion();
    }
    eth_getBlockByHash(hash, includeFullTransactions) {
        if (includeFullTransactions) {
            return this.client
                .eth_getBlockByHash(hash, true)
                .then(model_1.mustBeValidBlockWithFullTransactions);
        }
        else {
            return this.client
                .eth_getBlockByHash(hash, false)
                .then(model_1.mustBeValidBlockWithTransactionHashes);
        }
    }
    eth_getBlockByNumber(blockNumber, includeFullTransactions) {
        if (includeFullTransactions) {
            return this.client
                .eth_getBlockByNumber(blockNumber, true)
                .then(model_1.mustBeValidBlockWithFullTransactions);
        }
        else {
            return this.client
                .eth_getBlockByNumber(blockNumber, false)
                .then(model_1.mustBeValidBlockWithTransactionHashes);
        }
    }
    eth_blockNumber() {
        return this.client.eth_blockNumber();
    }
    eth_getLogs(filter) {
        return this.client
            .eth_getLogs(filter)
            .then(logs => logs.map(model_1.mustBeValidLog));
    }
    eth_getTransaction(hash) {
        return this.client.eth_getTransaction(hash).then(model_1.mustBeValidTransaction);
    }
    eth_getTransactionReceipt(hash) {
        return this.client
            .eth_getTransactionReceipt(hash)
            .then(model_1.mustBeValidTransactionReceipt);
    }
    eth_getTransactionReceipts(hashes) {
        return this.client
            .eth_getTransactionReceipts(hashes)
            .then(receipts => receipts.map(model_1.mustBeValidTransactionReceipt));
    }
    eth_sendTransaction(params) {
        return this.client.eth_sendTransaction(params).then(s => {
            if (typeof s !== 'string' || s.length !== 66) {
                throw new Error(`invalid transaction receipt: ${s}`);
            }
            return s;
        });
    }
    cmd(method, ...params) {
        return this.client.cmd(method, params);
    }
}
exports.default = ValidatedEthClient;

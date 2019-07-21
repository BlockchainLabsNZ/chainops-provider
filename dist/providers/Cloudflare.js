"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../request");
const web3_utils_1 = require("web3-utils");
class Cloudflare {
    constructor(key) {
        this.base = 'https://cloudflare-eth.com';
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 64
            });
            return web3_utils_1.toBN(response.data.result).toNumber();
        });
    }
    getBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: [web3_utils_1.toHex(block), true],
                id: 64
            });
            return response.data.result;
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                jsonrpc: '2.0',
                method: 'eth_getTransactionByHash',
                params: [txHash],
                id: 64
            });
            return response.data.result;
        });
    }
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                jsonrpc: '2.0',
                method: 'eth_getTransactionReceipt',
                params: [txHash],
                id: 64
            });
            return response.data.result;
        });
    }
    makeRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json'
            };
            const path = `${this.base}`;
            const response = yield request_1.request({
                method,
                headers,
                data,
                path
            });
            return response;
        });
    }
}
exports.Cloudflare = Cloudflare;
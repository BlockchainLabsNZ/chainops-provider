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
const index_1 = require("../lib/ethercast-eth-jsonrpc-client/src/index");
class JsonRpc {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield index_1.getClient(this.connectionString, true);
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error("Client has not yet be init'd");
            const result = yield this.client.eth_blockNumber();
            return result.toNumber();
        });
    }
    //@ts-ignore
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error("Client has not yet be init'd");
            const result = yield this.client.eth_getTransactionReceipt(txHash);
            return result;
        });
    }
    getBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error("Client has not yet be init'd");
            const result = (yield this.client.eth_getBlockByNumber(blockNumber, true));
            return result;
        });
    }
    getErc20Balance(contract, address) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getErc20Balance is not supported with JsonRpc');
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error("Client has not yet be init'd");
            const result = yield this.client.eth_getTransaction(txHash);
            return result;
        });
    }
}
exports.JsonRpc = JsonRpc;

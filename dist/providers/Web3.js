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
class WebThree {
    constructor(web3) {
        this.web3 = web3;
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getBlockNumber();
        });
    }
    getBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getBlock(blockNumber);
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getTransaction(txHash);
        });
    }
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getTransactionReceipt(txHash);
        });
    }
    getErc20Balance(contract, address) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getErc20Balance is not supported with Web3');
        });
    }
}
exports.WebThree = WebThree;

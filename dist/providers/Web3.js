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
    getBlock(blockNumber, returnTransactionObjects = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getBlock(blockNumber, returnTransactionObjects);
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
    getErc20Balance(contractAddress, holdingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // The minimum ABI to get ERC20 Token balance
            const minABI = [
                // balanceOf
                {
                    constant: true,
                    inputs: [{ name: '_owner', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: 'balance', type: 'uint256' }],
                    type: 'function'
                },
                // decimals
                {
                    constant: true,
                    inputs: [],
                    name: 'decimals',
                    outputs: [{ name: '', type: 'uint8' }],
                    type: 'function'
                }
            ];
            //@ts-ignore
            const contract = new this.web3.eth.Contract(minABI, contractAddress);
            const balanceOf = yield contract.methods['balanceOf'](holdingAddress);
            return balanceOf.call();
        });
    }
}
exports.WebThree = WebThree;

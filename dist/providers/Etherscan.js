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
const request_1 = require("../request");
const qs_1 = __importDefault(require("qs"));
const web3_utils_1 = require("web3-utils");
class Etherscan {
    constructor(key) {
        this.key = key;
        this.base = 'https://api.etherscan.io';
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                module: 'proxy',
                action: 'eth_blockNumber',
                apiKey: this.key
            }, null);
            return web3_utils_1.toBN(response.data.result).toNumber();
        });
    }
    getBlock(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                module: 'proxy',
                action: 'eth_getBlockByNumber',
                tag: web3_utils_1.toHex(number),
                apiKey: this.key
            }, null);
            if (!response.data.result)
                throw new Error('Etherscan getBlock: ' + number + ' - falsey');
            return response.data.result;
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                module: 'proxy',
                action: 'eth_getTransactionByHash',
                txhash: txHash,
                apiKey: this.key
            }, null);
            return response.data.result;
        });
    }
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest({
                module: 'proxy',
                action: 'eth_getTransactionReceipt',
                txhash: txHash,
                apiKey: this.key
            }, null);
            return response.data.result;
        });
    }
    makeRequest(qsParameters, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = 'GET';
            const queryString = qs_1.default.stringify(qsParameters);
            const headers = {};
            const path = `${this.base}/api?${queryString}`;
            const response = yield request_1.request({
                method,
                headers,
                data,
                path
            });
            return response;
        });
    }
    getErc20Balance(contract, address) {
        return __awaiter(this, void 0, void 0, function* () {
            //?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=YourApiKeyToken
            const response = yield this.makeRequest({
                module: 'account',
                action: 'tokenbalance',
                contractaddress: contract,
                address: address,
                tag: 'latest',
                apiKey: this.key
            }, null);
            return response.data.result;
        });
    }
}
exports.Etherscan = Etherscan;

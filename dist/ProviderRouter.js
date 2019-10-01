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
class ProviderRouter {
    constructor(options) {
        this.configuration = options;
        this.stats = {};
    }
    incrementStats(provider, method, priority) {
        this.stats[provider] = this.stats[provider] || {};
        this.stats[provider][method] = this.stats[provider][method] || {};
        this.stats[provider][method][priority] =
            this.stats[provider][method][priority] || 0;
        this.stats[provider][method][priority]++;
    }
    runMethod(methodName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = this.configuration.routing[methodName];
            for (let i = 0; i < order.length; i++) {
                const provider = this.configuration.providers[order[i]];
                try {
                    const result = args
                        ? yield provider[methodName].apply(provider, args)
                        : yield provider[methodName]();
                    this.incrementStats(order[i], methodName, i);
                    return result;
                }
                catch (err) {
                    if (i === order.length - 1) {
                        console.error('Error using', order[i], 'no more providers', err);
                        //hit the limit of all the providers
                        throw err;
                    }
                    else {
                        console.error('Error using', order[i], 'moving to next provider', err);
                    }
                }
            }
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getBlockNumber');
        });
    }
    getBlock(number, includeTransactions = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getBlock', number, includeTransactions);
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getTransaction', txHash);
        });
    }
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getTransactionReceipt', txHash);
        });
    }
    getErc20Balance(contract, address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getErc20Balance', contract, address);
        });
    }
}
exports.ProviderRouter = ProviderRouter;

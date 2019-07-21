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
                    // console.log('Returning from', order[i], '...')
                    return result;
                }
                catch (err) {
                    console.error('Error using', order[i], 'moving to next provider', err);
                    if (i === order.length - 1) {
                        //hit the limit of all the providers
                        throw err;
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
    getBlock(number) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runMethod('getBlock', number);
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
}
exports.ProviderRouter = ProviderRouter;
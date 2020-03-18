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
function sleep(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    });
}
exports.sleep = sleep;
/**
 * Wrap error handler in a closure to handle retryCount and sleep configuration
 *
 * @param sleepMilliseconds duration to wait between retries
 * @param maxRetries number of times to retry
 * @return errorHandler to be passed into Web3.attachConnectionErrorHandler(errorHandler)
 */
function makeConnectionHandler(sleepMilliseconds, maxRetries) {
    let retryCount = 0;
    return (err, retryCall) => __awaiter(this, void 0, void 0, function* () {
        console.debug('Caught connection error');
        if (retryCount < maxRetries) {
            retryCount++;
            console.debug(`Retrying ${retryCount} / ${maxRetries} after sleeping for ${sleepMilliseconds} ms`);
            yield sleep(sleepMilliseconds);
            return yield retryCall();
        }
        console.debug('Connection error retries exceeded, rethrowing error');
        throw err;
    });
}
exports.makeConnectionHandler = makeConnectionHandler;

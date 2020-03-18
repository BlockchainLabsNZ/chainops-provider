export declare function sleep(milliseconds: number): Promise<{}>;
/**
 * Wrap error handler in a closure to handle retryCount and sleep configuration
 *
 * @param sleepMilliseconds duration to wait between retries
 * @param maxRetries number of times to retry
 * @return errorHandler to be passed into Web3.attachConnectionErrorHandler(errorHandler)
 */
export declare function makeConnectionHandler(sleepMilliseconds: number, maxRetries: number): (err: Error, retryCall: any) => Promise<any>;

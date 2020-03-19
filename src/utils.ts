/**
 * Promise style sleep for await friendliness
 * @param milliseconds
 */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * Wrap error handler in a closure to handle retryCount and sleep configuration
 *
 * @param sleepMilliseconds duration to wait between retries
 * @param maxRetries number of times to retry
 * @return errorHandler to be passed into Web3.attachConnectionErrorHandler(errorHandler)
 */
export function makeConnectionHandler(
  sleepMilliseconds: number,
  maxRetries: number
) {
  let retryCount = 0
  return async (err: Error, retryCall: any) => {
    console.debug('Caught connection error')
    if (retryCount < maxRetries) {
      retryCount++
      console.debug(
        `Retrying ${retryCount} / ${maxRetries} after sleeping for ${sleepMilliseconds} ms`
      )
      await sleep(sleepMilliseconds)
      return await retryCall()
    }

    console.debug('Connection error retries exceeded, rethrowing error')
    throw err
  }
}

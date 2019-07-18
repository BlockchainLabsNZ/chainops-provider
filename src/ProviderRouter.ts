import { IProvider } from './providers/IProvider'

interface IOptions {
  routing: {
    [methodName: string]: string[]
  }
  providers: {
    [name: string]: IProvider
  }
}

type SupportedMethods =
  | 'getBlockNumber'
  | 'getTransaction'
  | 'getTransactionReceipt'
  | 'getBlock'

export class ProviderRouter {
  configuration: any
  constructor(options: IOptions) {
    this.configuration = options
  }

  async runMethod(methodName: SupportedMethods, ...args: any) {
    const order = this.configuration.routing[methodName]
    for (let i = 0; i < order.length; i++) {
      const provider = this.configuration.providers[order[i]]

      try {
        const result = args
          ? await provider[methodName].apply(provider, args)
          : await provider[methodName]()

        console.log('Returning from', order[i], '...')
        return result
      } catch (err) {
        console.error('Error using', order[i], 'moving to next provider', err)
        if (i === order.length - 1) {
          //hit the limit of all the providers
          throw err
        }
      }
    }
  }

  async getBlockNumber() {
    return this.runMethod('getBlockNumber')
  }

  async getBlock(number: number) {
    return this.runMethod('getBlock', number)
  }

  async getTransaction(txHash: string) {
    return this.runMethod('getTransaction', txHash)
  }

  async getTransactionReceipt(txHash: string) {
    return this.runMethod('getTransactionReceipt', txHash)
  }
}

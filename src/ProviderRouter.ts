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
  | 'getErc20Balance'

export class ProviderRouter {
  configuration: any
  stats: {
    [provider: string]: {
      [methodName: string]: {
        [priority: number]: number
      }
    }
  }
  constructor(options: IOptions) {
    this.configuration = options
    this.stats = {}
  }

  incrementStats(provider: string, method: string, priority: number) {
    this.stats[provider] = this.stats[provider] || {}
    this.stats[provider][method] = this.stats[provider][method] || {}
    this.stats[provider][method][priority] =
      this.stats[provider][method][priority] || 0
    this.stats[provider][method][priority]++
  }

  async runMethod(methodName: SupportedMethods, ...args: any) {
    const order = this.configuration.routing[methodName]
    for (let i = 0; i < order.length; i++) {
      const provider = this.configuration.providers[order[i]]

      try {
        const result = args
          ? await provider[methodName].apply(provider, args)
          : await provider[methodName]()

        this.incrementStats(order[i], methodName, i)
        return result
      } catch (err) {
        if (i === order.length - 1) {
          console.error('Error using', order[i], 'no more providers', err)
          //hit the limit of all the providers
          throw err
        } else {
          console.error('Error using', order[i], 'moving to next provider', err)
        }
      }
    }
  }

  async getBlockNumber() {
    return this.runMethod('getBlockNumber')
  }

  async getBlock(number: number, includeTransactions: boolean = false) {
    return this.runMethod('getBlock', number, includeTransactions)
  }

  async getTransaction(txHash: string) {
    return this.runMethod('getTransaction', txHash)
  }

  async getTransactionReceipt(txHash: string) {
    return this.runMethod('getTransactionReceipt', txHash)
  }

  async getErc20Balance(contract: string, address: string) {
    return this.runMethod('getErc20Balance', contract, address)
  }
}

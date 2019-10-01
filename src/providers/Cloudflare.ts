import { IProvider } from './IProvider'
import { request } from '../request'
import { toBN, toHex } from 'web3-utils'
import { throttle } from 'lodash'

export interface ICloudflareOptions {
  // max number of calls per second
  throttle: number
}

const DefaultOptions: ICloudflareOptions = {
  throttle: 0
}

export class Cloudflare implements IProvider {
  base: string
  nextRequestId: number
  options: ICloudflareOptions
  makeRequest: (options: any) => Promise<any>

  constructor(options: ICloudflareOptions = DefaultOptions) {
    this.options = options
    this.base = 'https://cloudflare-eth.com'
    this.nextRequestId = 0

    const wait = this.options.throttle ? 1000 / this.options.throttle : 0
    this.makeRequest = throttle(this._makeRequest, wait).bind(this)
  }

  async getBlockNumber() {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: this.nextRequestId++
    })

    return toBN(response.data.result).toNumber()
  }

  async getErc20Balance(contract: string, address: string): Promise<number> {
    throw new Error('getErc20Balance is not supported with Cloudflare')
  }

  async getBlock(block: number, includeTransactionObjects: boolean = false) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [toHex(block), includeTransactionObjects],
      id: this.nextRequestId++
    })

    if (!response.data.result)
      throw new Error('Cloudflare getBlock: ' + block + ' - falsey')
    return response.data.result
  }

  async getTransaction(txHash: string) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: this.nextRequestId++
    })

    return response.data.result
  }

  async getTransactionReceipt(txHash: string) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: this.nextRequestId++
    })

    if (response.data.result === null)
      throw new Error('Cloudflare getTransactionReceipt: ' + txHash + ' - null')

    return response.data.result
  }

  async _makeRequest(data: any) {
    const method = 'POST'
    const headers = {
      'Content-Type': 'application/json'
    }

    const path = `${this.base}`

    const response = await request({
      method,
      headers,
      data,
      path
    })

    return response
  }
}

import { IProvider } from './IProvider'
import { request } from '../request'
import { toBN, toHex } from 'web3-utils'

export class Cloudflare implements IProvider {
  base: string

  constructor(key: string) {
    this.base = 'https://cloudflare-eth.com'
  }

  async getBlockNumber() {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 64
    })

    return toBN(response.data.result).toNumber()
  }

  async getBlock(block: number) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [toHex(block), true],
      id: 64
    })

    return response.data.result
  }

  async getTransaction(txHash: string) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 64
    })

    return response.data.result
  }

  async getTransactionReceipt(txHash: string) {
    const response = await this.makeRequest({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 64
    })

    return response.data.result
  }

  async makeRequest(data: any) {
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

import { IProvider } from './IProvider'
import { request } from '../request'
import qs from 'qs'
import { toBN, toHex } from 'web3-utils'

export class Etherscan implements IProvider {
  key: string
  base: string

  constructor(key: string) {
    this.key = key
    this.base = 'https://api.etherscan.io'
  }

  async getBlockNumber() {
    const response = await this.makeRequest(
      {
        module: 'proxy',
        action: 'eth_blockNumber',
        apiKey: this.key
      },
      null
    )

    return toBN(response.data.result).toNumber()
  }

  async getBlock(number: number) {
    const response = await this.makeRequest(
      {
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: toHex(number),
        apiKey: this.key
      },
      null
    )

    if (!response.data.result)
      throw new Error('Etherscan getBlock: ' + number + ' - falsey')

    return response.data.result
  }

  async getTransaction(txHash: string) {
    const response = await this.makeRequest(
      {
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: txHash,
        apiKey: this.key
      },
      null
    )

    return response.data.result
  }

  async getTransactionReceipt(txHash: string) {
    const response = await this.makeRequest(
      {
        module: 'proxy',
        action: 'eth_getTransactionReceipt',
        txhash: txHash,
        apiKey: this.key
      },
      null
    )

    return response.data.result
  }

  async makeRequest(qsParameters: Object, data: any) {
    const method = 'GET'
    const queryString = qs.stringify(qsParameters)
    const headers = {}

    const path = `${this.base}/api?${queryString}`

    const response = await request({
      method,
      headers,
      data,
      path
    })

    return response
  }
}

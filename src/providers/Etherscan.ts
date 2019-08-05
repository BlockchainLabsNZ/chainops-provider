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

  async getErc20Balance(contract: string, address: string) {
    //?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=YourApiKeyToken
    const response = await this.makeRequest(
      {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: contract,
        address: address,
        tag: 'latest',
        apiKey: this.key
      },
      null
    )

    return response.data.result
  }
}

import {
  getClient,
  EthClient
} from '../lib/ethercast-eth-jsonrpc-client/src/index'
import { IProvider } from './IProvider'
import { Block } from 'web3-eth'

export class JsonRpc implements IProvider {
  client: EthClient | undefined
  connectionString: string

  constructor(connectionString: string) {
    this.connectionString = connectionString
  }

  async init() {
    this.client = await getClient(this.connectionString, true)
  }

  async getBlockNumber() {
    if (!this.client) throw new Error("Client has not yet be init'd")
    const result: any = await this.client.eth_blockNumber()
    return <number>result.toNumber()
  }

  //@ts-ignore
  async getTransactionReceipt(txHash: string) {
    if (!this.client) throw new Error("Client has not yet be init'd")
    const result = await this.client.eth_getTransactionReceipt(txHash)
    return result
  }

  async getBlock(blockNumber: number) {
    if (!this.client) throw new Error("Client has not yet be init'd")
    const result = <Block>(
      (<unknown>await this.client.eth_getBlockByNumber(blockNumber, true))
    )
    return result
  }

  async getTransaction(txHash: string) {
    if (!this.client) throw new Error("Client has not yet be init'd")
    const result: any = await this.client.eth_getTransaction(txHash)
    return result
  }
}

import Web3 from 'web3'
import { IProvider } from './IProvider'

export class WebThree implements IProvider {
  web3: Web3

  constructor(web3: Web3) {
    this.web3 = web3
  }

  async getBlockNumber() {
    return this.web3.eth.getBlockNumber()
  }

  async getBlock(blockNumber: number) {
    return this.web3.eth.getBlock(blockNumber)
  }

  async getTransaction(txHash: string) {
    return this.web3.eth.getTransaction(txHash)
  }

  async getTransactionReceipt(txHash: string) {
    return this.web3.eth.getTransactionReceipt(txHash)
  }

  async getErc20Balance(contract: string, address: string): Promise<number> {
    throw new Error('getErc20Balance is not supported with Web3')
  }
}

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

  async getErc20Balance(
    contractAddress: string,
    holdingAddress: string
  ): Promise<number> {
    // The minimum ABI to get ERC20 Token balance
    const minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function'
      },
      // decimals
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function'
      }
    ]

    //@ts-ignore
    const contract = new this.web3.eth.Contract(minABI, contractAddress)
    const balanceOf = await contract.methods['balanceOf'](holdingAddress)
    return balanceOf.call()
  }
}

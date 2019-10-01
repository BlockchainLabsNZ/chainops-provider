import { Block } from 'web3-eth'
import { TransactionReceipt, Transaction } from 'web3-core'

export interface IProvider {
  getBlockNumber: () => Promise<number>
  getBlock: (
    blockNumber: number,
    includeTransactions?: boolean
  ) => Promise<Block>
  getTransaction: (txHash: string) => Promise<Transaction>
  getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>
  getErc20Balance: (contract: string, address: string) => Promise<number>
}

export interface IProvider {
  getBlockNumber: () => Promise<number>
  // getBlockNumber: () => Promise<number>
  // getTransaction: (txHash: string) => Promise<Transaction>
}

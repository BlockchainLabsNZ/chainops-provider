export interface IProvider {
    getBlockNumber: () => Promise<number>;
}

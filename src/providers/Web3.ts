import Web3 from 'web3'
import { IProvider } from './IProvider'
import BigNumber from 'bignumber.js'

type Web3Call<T> = () => Promise<T>
type Web3ConnectionErrorHandler = <T>(err: Error, call: Web3Call<T>) => any

export class WebThree implements IProvider {
  web3: Web3
  _web3ConnectionErrorHandler?: Web3ConnectionErrorHandler

  constructor(web3: Web3) {
    this.web3 = web3
  }

  /**
   * Get the current block number
   * @return number
   */
  async getBlockNumber() {
    return this._wrapWeb3Call(() => this.web3.eth.getBlockNumber())
  }

  /**
   * Get the block body
   * @param blockNumber {number}
   * @param returnTransactionObjects {boolean}
   *  true - include Transaction bodies
   *  false - include Transaction hash string
   * @returns Block
   */
  async getBlock(
    blockNumber: number,
    returnTransactionObjects: boolean = false
  ) {
    return this._wrapWeb3Call(() =>
      this.web3.eth.getBlock(blockNumber, returnTransactionObjects)
    )
  }

  /**
   * Get the transaction body
   * @param txHash
   * @return Promise<Transaction>
   */
  async getTransaction(txHash: string) {
    return this._wrapWeb3Call(() => this.web3.eth.getTransaction(txHash))
  }

  /**
   * Get the transaction receipt
   * @param txHash
   * @return Promise<TransactionReceipt>
   */
  async getTransactionReceipt(txHash: string) {
    return this._wrapWeb3Call(() => this.web3.eth.getTransactionReceipt(txHash))
  }

  /**
   * Retrieves token address balance from contract storage
   * @param contractAddress token contract address
   * @param holdingAddress address that owns the tokens
   * @returns BigNumber uint256 balance
   */
  async getErc20Balance(
    contractAddress: string,
    holdingAddress: string
  ): Promise<BigNumber> {
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

    return await this._wrapWeb3Call(async () => {
      //@ts-ignore
      const contract = new this.web3.eth.Contract(minABI, contractAddress)
      const balanceOf = await contract.methods['balanceOf'](holdingAddress)
      return <BigNumber>balanceOf.call()
    })
  }

  /**
   * Timeout wrapper around isWeb3Ready
   * will throw if web3 is not connected by waitSeconds
   * @param waitSeconds allowed connection time
   */
  async waitForWeb3Connection(waitSeconds: number) {
    const web3Ready = this.isWeb3Ready()
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`web3 connection not made within ${waitSeconds} secs`))
      }, waitSeconds * 1000)
    })

    return Promise.race([web3Ready, timeout])
  }

  /**
   * Checks if the web3 connection has been established
   * N.B. use this sparingly with rate limited services
   * like infura, each time you call this function it will
   * use up 1 call
   */
  async isWeb3Ready() {
    try {
      const netIsListening = await this.web3.eth.net.isListening()
      console.debug(`web3 websocket status: ${netIsListening}`)
    } catch (error) {
      console.error(`web3 connection error`, error)
      throw error
    }
  }

  /**
   * Makes the disconnect calls to web3
   * Both calls appear to work but are poorly documented
   */
  disconnect() {
    // @ts-ignore
    this.web3.currentProvider.connection.close()
    // @ts-ignore
    this.web3.currentProvider.disconnect()
  }

  /**
   * Wraps the web3 calls so we can test for connection errors
   * If a connection handler is defined it will call the handler
   * Otherwise it will rethrow
   * @param call Web3 call in arrow function expression
   * This allows us to retain the typings with Generic Types <T> 
   * @example
        this._wrapWeb3Call(() => this.web3.eth.getTransaction(txHash))
   */
  async _wrapWeb3Call<T>(call: Web3Call<T>): Promise<T> {
    try {
      const result = await call()
      return result
    } catch (err) {
      if (!this._web3ConnectionErrorHandler) throw err

      if (err.message.indexOf('Connection error') > -1) {
        return this._web3ConnectionErrorHandler(err, () => {
          return this._wrapWeb3Call(call)
        })
      }

      console.error('web3 error', err)
      throw err
    }
  }

  /**
   * Adds an error handler which will be invoked if
   * Web3 calls throw with 'Connection error'
   * By default will be undefined
   * Can be explicitly set back to undefined if required
   * @param handler Web3ConnectionErrorHandler | undefined
   */
  attachConnectionErrorHandler(
    handler: Web3ConnectionErrorHandler | undefined
  ) {
    this._web3ConnectionErrorHandler = handler
  }
}

const {
  ProviderRouter,
  WebThree,
  utils,
} = require('../dist/index')

async function main() {
  const Web3 = require('web3')
  const web3 = new Web3(
    'wss://mainnet.infura.io/ws/v3/930b7ab27bea440b94b7cc1590aace1f'
  )

  const infura = new WebThree(web3)

  const config = {
    routing: {
      //[method call]: [provider keys in order]
      getBlockNumber: ['infura'],
      getBlock: ['infura'],
      getTransaction: ['infura'],
      getTransactionReceipt: ['infura']
    },
    providers: {
      infura: infura,
    }
  }

  const router = new ProviderRouter(config)

  // retry success - 3 seconds is normallly enough to reconnect and will succeed on 3rd go
  // getTransaction will actually try to reconnect
  infura.attachConnectionErrorHandler(utils.makeConnectionHandler(3000, 3))

  // retry success - 1 seconds is not enough to reconnect and it'll fail completely
  // infura.attachConnectionErrorHandler(utils.makeConnectionHandler(3000, 3))

  try {
    // Disconnect from Infura, to force the subsequent `getTransaction()` call to attempt to reconnect.
    await infura.disconnect()
    const tx = await router.getTransaction(
      '0x423482682132fcbeb302489de19009d442b633a895632efc7a4a64226a67213d'
    )
    console.log(tx)
  } catch (err) {
    console.error('error', err.message)
    process.exit(1)
  }

  process.exit(0)
}

main()

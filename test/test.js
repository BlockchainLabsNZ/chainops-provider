const { ProviderRouter, WebThree, Etherscan, Cloudflare } = require('../dist/index')

async function main() {
  const Web3 = require('web3')
  const web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe6f23c0b4d468ebf02a2d3142b0e10')
  //web3 connect

  const infura = new WebThree(web3)
  const etherscan = new Etherscan('YourApiKeyToken')
  const cloudflare = new Cloudflare()

  const config = {
    routing: {
      //[method call]: [provider keys in order]
      getBlockNumber: ['cloudflare', 'etherscan', 'infura'],
      getBlock: ['cloudflare', 'etherscan', 'infura'],
      getTransaction: ['cloudflare', 'etherscan', 'infura'],
      getTransactionReceipt: ['cloudflare', 'etherscan', 'infura'],
    },
    providers: {
      infura: infura,
      etherscan: etherscan,
      cloudflare: cloudflare
    }
  }

  const router = new ProviderRouter(config)
  console.log(await router.getBlockNumber())
  console.log(await router.getBlock(8173667))
  console.log(await router.getTransaction('0x423482682132fcbeb302489de19009d442b633a895632efc7a4a64226a67213d'))
  console.log(await router.getTransactionReceipt('0x423482682132fcbeb302489de19009d442b633a895632efc7a4a64226a67213d'))

}

main()
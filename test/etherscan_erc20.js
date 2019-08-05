const { ProviderRouter, Etherscan } = require('../dist/index')

async function main() {
  const etherscan = new Etherscan('YourApiKeyToken')

  const config = {
    routing: {
      //[method call]: [provider keys in order]
      getErc20Balance: ['etherscan']
    },
    providers: {
      etherscan: etherscan
    }
  }

  const router = new ProviderRouter(config)
  console.log(
    await router.getErc20Balance(
      '0xdd6bf56ca2ada24c683fac50e37783e55b57af9f',
      '0x748c04a0e7ebda89d08cef89fe8a79ad6dcaf8c2'
    )
  )
  console.log(router.stats)
}

main()

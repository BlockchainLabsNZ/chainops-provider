# Web3 Connection Error Handler

## Context

Web3 wss connections sometimes take longer to establish. The previous pattern was to use the `isListening` to wait for web3 to become ready. However with many parallel processes also trying to connect it resulted in too many calls which was problematic in a rate-limited environment like infura.

## Solution

The normal usage for the Web3 provider is to initiate the actual Web3 module and then pass it this library's WebThree provider (wrapper) like so:

```js
const { WebThree } = require('../dist/index')
const Web3 = require('web3')

const web3 = new Web3('wss://mainnet.infura.io/ws/v3/your-precious-project-key')

const infura = new WebThree(web3)
```

Now, add an extra call afterwards:

```js
+ const { utils } = require('../dist/index')

  const infura = new WebThree(web3)
+ infura.attachConnectionErrorHandler(utils.makeConnectionHandler(3000, 3))
```

Where `utils.makeConnectionHandler(milliseconds, retryLimit)` is a closure function which returns a retry function to attach.

--

Web3 provider class `src/providers/Web3` still has the `isWeb3Ready` call and the `waitForWeb3Connection` methods if required.

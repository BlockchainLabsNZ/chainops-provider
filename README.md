# chainops-provider

The chainops-provider module allows your application to call multiple data providers for data.

- define a prioritised list of providers for each method
- if an error is thrown, it will fallback to the next provider

See test/test.js for an example

## Configuration

Instantiate the ProviderRouter class with a configuration object as defined in src/ProviderRouter.ts/IOptions.

Example:

```typescript
const config = {
  routing: {
    //[method call]: [provider keys in order]
    getBlockNumber: ['cloudflare', 'etherscan', 'infura'],
    getBlock: ['cloudflare', 'etherscan', 'infura'],
    getTransaction: ['cloudflare', 'etherscan', 'infura'],
    getTransactionReceipt: ['cloudflare', 'etherscan', 'infura']
  },
  providers: {
    infura: infura,
    etherscan: etherscan,
    cloudflare: cloudflare
  }
}
```

'providers' property is an object that takes a name (used later): provider

The providers can be found in the providers/ folder and are exposed in the index require.

### 3 providers exist (at the moment)

#### Webthree

Instantiate a Web3 connection and pass it as a constructor prop

#### Etherscan

Constructor prop expects an ApiKeyToken (get it from the Etherscan site)

#### Cloudflare

Cloudflare has no keys and can be instantiated with no props

## Extending

### Providers

Unless a custom API endpoint is used (like Cloudflare or Etherscan) there shouldn't be a need to create new providers. The Webthree provider is designed to wrap a Web3 endpoint which itself can call http, websocket providers

### Methods

Each method must be implemented in this module before being called.
Each provider must then support passing through that method to their respective sources.

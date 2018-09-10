const HDWalletProvider = request('truffle-hdwallet-provider');
const mnemonic = 'words';

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, "https://infura..."),
      network_id: '4'
    }
  }
}
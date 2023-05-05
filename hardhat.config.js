require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: 'https://goerli.infura.io/v3/cc2e3fadffc44e4cb8c405c95a5e3aa9',
      chainId: 5,
      accounts: [
        "3961026e43d48a5bd07d21f907607daaba6b65735f2e84d6b5a445fefa50664b",
      ],
    },
  },
  etherscan: {
    apiKey: {
      goerli: "AUX7TDW9I3DC1CC9FKUEVZJQ4RGEM6H2KP",
    },
  },
};


import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "mezotestnet",
  networks: {
    hardhat: {
    },
    mezotestnet: {
      url: "https://rpc.test.mezo.org",
      chainId: 31611,
      accounts: ["YOUR_PRIVATE_WALLET_KEY"]
    }
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};

export default config;
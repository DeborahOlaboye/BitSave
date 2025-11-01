import { ethers } from 'ethers';
import axios from 'axios';

// Mezo contract addresses (replace with actual addresses from documentation)
const MEZO_BORROW_CONTRACT = process.env.MEZO_BORROW_CONTRACT || '';
const MEZO_MUSD_CONTRACT = process.env.MEZO_MUSD_CONTRACT || '';
const MEZO_VAULT_CONTRACT = process.env.MEZO_VAULT_CONTRACT || '';

// Initialize provider
const provider = new ethers.JsonRpcProvider(
  process.env.MEZO_RPC_URL || 'https://testnet-rpc.mezo.org'
);

// Simplified ABIs (replace with actual ABIs from Mezo documentation)
const MUSD_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

const VAULT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function deposit(uint256 amount) returns (bool)',
  'function withdraw(uint256 amount) returns (bool)',
  'function getAPY() view returns (uint256)',
];

const BORROW_ABI = [
  'function depositAndBorrow(uint256 btcAmount) payable returns (uint256)',
  'function getBorrowPosition(address user) view returns (uint256)',
];

export const mezoService = {
  // Get MUSD balance
  async getMusdBalance(address: string): Promise<string> {
    try {
      const musdContract = new ethers.Contract(MEZO_MUSD_CONTRACT, MUSD_ABI, provider);
      const balance = await musdContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Error getting MUSD balance:', error);
      return '0.00';
    }
  },

  // Get vault balance
  async getVaultBalance(address: string): Promise<string> {
    try {
      const vaultContract = new ethers.Contract(MEZO_VAULT_CONTRACT, VAULT_ABI, provider);
      const balance = await vaultContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Error getting vault balance:', error);
      return '0.00';
    }
  },

  // Get total balance (MUSD + Vault)
  async getTotalBalance(address: string): Promise<{ musdBalance: string; vaultBalance: string; totalBalance: string }> {
    try {
      const musdBalance = await this.getMusdBalance(address);
      const vaultBalance = await this.getVaultBalance(address);
      const total = (parseFloat(musdBalance) + parseFloat(vaultBalance)).toFixed(2);

      return {
        musdBalance: parseFloat(musdBalance).toFixed(2),
        vaultBalance: parseFloat(vaultBalance).toFixed(2),
        totalBalance: total,
      };
    } catch (error) {
      console.error('Error getting total balance:', error);
      return {
        musdBalance: '0.00',
        vaultBalance: '0.00',
        totalBalance: '0.00',
      };
    }
  },

  // Get vault APY
  async getVaultAPY(): Promise<string> {
    try {
      const vaultContract = new ethers.Contract(MEZO_VAULT_CONTRACT, VAULT_ABI, provider);
      const apy = await vaultContract.getAPY();
      return ethers.formatUnits(apy, 2); // Assuming APY is stored with 2 decimals
    } catch (error) {
      console.error('Error getting vault APY:', error);
      return '5.00'; // Default APY
    }
  },

  // Get BTC price from CoinGecko
  async getBtcPrice(): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      return response.data.bitcoin.usd;
    } catch (error) {
      console.error('Error getting BTC price:', error);
      return 45000; // Default fallback price
    }
  },

  // Get user's borrow position
  async getBorrowPosition(address: string): Promise<string> {
    try {
      const borrowContract = new ethers.Contract(MEZO_BORROW_CONTRACT, BORROW_ABI, provider);
      const position = await borrowContract.getBorrowPosition(address);
      return ethers.formatUnits(position, 18);
    } catch (error) {
      console.error('Error getting borrow position:', error);
      return '0.00';
    }
  },

  // Get vault info
  async getVaultInfo(): Promise<{ apy: string; totalDeposits: string; userDeposits: string }> {
    try {
      const apy = await this.getVaultAPY();
      return {
        apy,
        totalDeposits: '0', // Would need to implement getTotalDeposits
        userDeposits: '0',  // Would need to implement getUserDeposits
      };
    } catch (error) {
      console.error('Error getting vault info:', error);
      return {
        apy: '5.00',
        totalDeposits: '0',
        userDeposits: '0',
      };
    }
  },
};

import { ethers, BrowserProvider } from 'ethers';

// Contract addresses (from environment variables)
const MEZO_BORROW_CONTRACT = process.env.NEXT_PUBLIC_MEZO_BORROW_CONTRACT || '';
const MEZO_MUSD_CONTRACT = process.env.NEXT_PUBLIC_MEZO_MUSD_CONTRACT || '';
const MEZO_VAULT_CONTRACT = process.env.NEXT_PUBLIC_MEZO_VAULT_CONTRACT || '';

// Simplified ABIs
const MUSD_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

const VAULT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function deposit(uint256 amount) returns (bool)',
  'function withdraw(uint256 amount) returns (bool)',
  'function getAPY() view returns (uint256)',
];

const BORROW_ABI = [
  'function depositAndBorrow(uint256 btcAmount) payable returns (uint256)',
  'function getBorrowPosition(address user) view returns (tuple(uint256 collateral, uint256 debt, uint256 ratio))',
  'function repayAndWithdraw(uint256 amount) returns (bool)',
];

export const mezoService = {
  // Get provider and signer
  async getProviderAndSigner() {
    if (!window.ethereum) {
      throw new Error('No ethereum provider found');
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  },

  // Deposit BTC and borrow MUSD
  async depositAndBorrow(btcAmount: string): Promise<{ txHash: string; musdAmount: string }> {
    try {
      const { signer } = await this.getProviderAndSigner();
      const borrowContract = new ethers.Contract(MEZO_BORROW_CONTRACT, BORROW_ABI, signer);

      const btcWei = ethers.parseEther(btcAmount);
      const tx = await borrowContract.depositAndBorrow(btcWei, { value: btcWei });
      const receipt = await tx.wait();

      // Extract MUSD amount from events (simplified)
      const musdAmount = ethers.formatUnits(btcWei, 18); // Simplified calculation

      return {
        txHash: receipt.hash,
        musdAmount,
      };
    } catch (error) {
      console.error('Error in depositAndBorrow:', error);
      throw error;
    }
  },

  // Transfer MUSD to another address
  async transferMusd(to: string, amount: string): Promise<string> {
    try {
      const { signer } = await this.getProviderAndSigner();
      const musdContract = new ethers.Contract(MEZO_MUSD_CONTRACT, MUSD_ABI, signer);

      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await musdContract.transfer(to, amountWei);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error('Error in transferMusd:', error);
      throw error;
    }
  },

  // Deposit MUSD to vault
  async depositToVault(amount: string): Promise<string> {
    try {
      const { signer } = await this.getProviderAndSigner();
      const musdContract = new ethers.Contract(MEZO_MUSD_CONTRACT, MUSD_ABI, signer);
      const vaultContract = new ethers.Contract(MEZO_VAULT_CONTRACT, VAULT_ABI, signer);

      const amountWei = ethers.parseUnits(amount, 18);

      // Check allowance
      const address = await signer.getAddress();
      const allowance = await musdContract.allowance(address, MEZO_VAULT_CONTRACT);

      // Approve if needed
      if (allowance < amountWei) {
        const approveTx = await musdContract.approve(MEZO_VAULT_CONTRACT, amountWei);
        await approveTx.wait();
      }

      // Deposit
      const tx = await vaultContract.deposit(amountWei);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error('Error in depositToVault:', error);
      throw error;
    }
  },

  // Withdraw from vault
  async withdrawFromVault(amount: string): Promise<string> {
    try {
      const { signer } = await this.getProviderAndSigner();
      const vaultContract = new ethers.Contract(MEZO_VAULT_CONTRACT, VAULT_ABI, signer);

      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await vaultContract.withdraw(amountWei);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error('Error in withdrawFromVault:', error);
      throw error;
    }
  },

  // Get user's MUSD balance
  async getMusdBalance(address: string): Promise<string> {
    try {
      const { provider } = await this.getProviderAndSigner();
      const musdContract = new ethers.Contract(MEZO_MUSD_CONTRACT, MUSD_ABI, provider);

      const balance = await musdContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Error in getMusdBalance:', error);
      return '0.00';
    }
  },
};

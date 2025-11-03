# BitSave - Bitcoin-Backed Banking App

BitSave is a Bitcoin-backed banking application built on Mezo's MUSD stablecoin protocol. It enables users to save, send, and spend Bitcoin-backed dollars with instant transactions and zero fees, targeting emerging markets for remittances and financial inclusion.

## Mezo Integration Overview

BitSave leverages Mezo's protocol for:
- **BTC Collateralization**: Users deposit Bitcoin and borrow MUSD via Mezo's BorrowerOperations contract
- **MUSD Token**: All transactions use Mezo's native MUSD stablecoin
- **Price Oracle**: Real-time BTC pricing from Mezo's PriceFeed contract
- **Position Management**: Integration with Mezo's TroveManager for collateral tracking

**Network**: Mezo Testnet (Chain ID: 31611)

**See detailed integration below**: [Where Mezo Integration Lives](#mezo-integration-detailed)

## Features

### Save
Deposit Bitcoin as collateral and borrow MUSD stablecoins at a 1:1.5 collateral ratio (150% collateralization). Create multiple savings goals with time-locks to organize your Bitcoin-backed dollars.

### Send
Send instant, fee-free peer-to-peer payments to other BitSave users by username (@username). Receive payments via QR code. All transactions are recorded with optional notes and real-time history.

### Spend
Purchase airtime, data bundles, and gift cards for 150+ countries via integrated Bitrefill API. Spend your MUSD balance directly on everyday services.

## Target Market

Primarily focused on remittances and financial inclusion in emerging markets, where traditional banking fees are high and transaction times are slow. BitSave provides instant, zero-fee transfers with Bitcoin-backed security.

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- RainbowKit, Mezo Passport & Wagmi v2 
- Viem
- React Context API & Zustand (state management)

### Smart Contracts
- Hardhat
- Solidity 0.8.20
- OpenZeppelin Contracts v5.4.0
- Deployed on Mezo Testnet (Chain ID: 31611)

### Blockchain Integration
- Mezo Protocol (Bitcoin Layer 2)
- MUSD Stablecoin
- Mezo BorrowerOperations, TroveManager, PriceFeed contracts

## Project Structure

```
Mezo/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── register/        # User registration
│   │   ├── dashboard/       # Main dashboard
│   │   ├── deposit/         # BTC deposit & borrow MUSD (MAIN MEZO INTEGRATION)
│   │   ├── save/            # Savings goals
│   │   ├── send/            # P2P transfers
│   │   └── spend/           # Airtime/data purchases
│   ├── components/          # Reusable UI components
│   ├── lib/
│   │   ├── contracts/       # Contract ABIs and addresses
│   │   │   ├── mezo-addresses.ts      # MEZO CONTRACT ADDRESSES
│   │   │   ├── addresses.ts           # Combined addresses
│   │   │   └── abis/
│   │   │       └── MezoBorrowerOperations.ts  # MEZO ABI
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useMezo.ts              # MEZO PROTOCOL HOOKS
│   │   │   └── useContracts.ts         # BitSave contract hooks
│   │   ├── services/        # API and blockchain services
│   │   │   └── mezo.ts                 # MEZO SERVICE LAYER
│   │   ├── config/          # Chain and Wagmi configuration
│   │   │   ├── chains.ts               # MEZO TESTNET CONFIG
│   │   │   └── wagmi.ts
│   │   └── contexts/        # React contexts
│   └── package.json
│
├── contracts/               # Smart contracts
│   ├── contracts/
│   │   ├── BitSaveRegistry.sol   # Username-to-address mapping (uses MUSD)
│   │   ├── BitSaveVault.sol      # Savings goals (uses MUSD)
│   │   └── BitSavePayments.sol   # P2P payments (uses MUSD)
│   ├── deployments.json          # Deployed contract addresses
│   ├── hardhat.config.ts         # Mezo Testnet config
│   └── README.md                 # Contract documentation
│
└── README.md                # This file
```

## Mezo Integration

### Where Mezo Integration Lives in the Repo

#### 1. Smart Contracts (Mezo-Powered)

**Location**: [`/contracts`](contracts/)

All three custom contracts interact with Mezo's MUSD token:

- **[BitSaveRegistry.sol](contracts/contracts/BitSaveRegistry.sol)** - Username-to-address mapping for easy P2P payments
  - Uses MUSD for payment resolution
  - Deployed at: `0xc5E45f7888a4FdAA75291aeF8A86DC83475243e5`
  - [View on Explorer](https://explorer.test.mezo.org/address/0xc5E45f7888a4FdAA75291aeF8A86DC83475243e5)

- **[BitSaveVault.sol](contracts/contracts/BitSaveVault.sol)** - Savings goals management (complements Mezo Savings Rate)
  - Manages MUSD deposits for budgeting
  - Time-locked savings goals
  - Deployed at: `0xB926b83d42829b58814EE3088C163B59496c0610`
  - [View on Explorer](https://explorer.test.mezo.org/address/0xB926b83d42829b58814EE3088C163B59496c0610)

- **[BitSavePayments.sol](contracts/contracts/BitSavePayments.sol)** - P2P transfers and purchase tracking
  - Handles MUSD transfers between users
  - Records transaction history
  - Deployed at: `0x7fC58f2d50790F6CDDB631b4757f54b893692DDe`
  - [View on Explorer](https://explorer.test.mezo.org/address/0x7fC58f2d50790F6CDDB631b4757f54b893692DDe)

**Contract Documentation**: [contracts/README.md](contracts/README.md)

#### 2. Frontend Integration - Contract Configuration

**Mezo Contract Addresses**:

File: [`frontend/lib/contracts/mezo-addresses.ts`](frontend/lib/contracts/mezo-addresses.ts)

```typescript
export const MEZO_ADDRESSES = {
  // Mezo Protocol Contracts (Official)
  MUSD: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503',
  BorrowerOperations: '0x575539e5c36d2293b0f506AC34b09FF7e2ae0771', // Proxy
  TroveManager: '0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0',
  PriceFeed: '0x86bCF0841622a5dAC14A313a15f96A95421b9366',
  SortedTroves: '0x722E4D24FD6Ff8b0AC679450F3D91294607268fA'
}
```

**Mezo Contract ABIs**:

File: [`frontend/lib/contracts/abis/MezoBorrowerOperations.ts`](frontend/lib/contracts/abis/MezoBorrowerOperations.ts)

Contains the full ABI for interacting with Mezo's BorrowerOperations contract (openTrove, closeTrove, etc.)

**Combined Addresses**:

File: [`frontend/lib/contracts/addresses.ts`](frontend/lib/contracts/addresses.ts)

Exports both Mezo and BitSave contract addresses for easy import throughout the app.

#### 3. Frontend Integration - Mezo Hooks

File: [`frontend/lib/hooks/useMezo.ts`](frontend/lib/hooks/useMezo.ts)

This file contains all React hooks for interacting with Mezo's protocol:

**`useOpenTrove()`** - Deposit BTC and borrow MUSD

**`useCloseTrove()`** - Repay MUSD and close position

**`useGetTrovePosition()`** - Get user's collateral and debt

**`useGetBtcPrice()`** - Get BTC price from Mezo oracle

#### 4. Frontend Integration - Mezo Services

File: [`frontend/lib/services/mezo.ts`](frontend/lib/services/mezo.ts)

Blockchain service layer using ethers.js for Mezo RPC connection and contract interactions.

#### 5. Frontend Integration - Chain Configuration

File: [`frontend/lib/config/chains.ts`](frontend/lib/config/chains.ts)

This configuration is used by Wagmi and RainbowKit for wallet connection.

#### 6. Pages Using Mezo

**Deposit Page** (PRIMARY MEZO INTEGRATION):

File: [`frontend/app/deposit/page.tsx`](frontend/app/deposit/page.tsx)

This is the main page where users interact with Mezo's protocol:

- Deposits BTC to Mezo's BorrowerOperations contract
- Opens trove and borrows MUSD
- Shows collateral ratio (150%)
- Displays expected MUSD based on BTC amount
- Real-time BTC price from Mezo's PriceFeed oracle
- Minimum 2000 MUSD to open trove

**Other Pages**:
- **[Dashboard](frontend/app/dashboard/page.tsx)** - Shows MUSD balance from Mezo
- **[Save](frontend/app/save/page.tsx)** - Creates savings goals with borrowed MUSD
- **[Send](frontend/app/send/page.tsx)** - P2P MUSD transfers
- **[Spend](frontend/app/spend/page.tsx)** - Spend MUSD on airtime/data

#### 7. Key Mezo Features Used

**A. Borrowing (openTrove)**

**B. Position Management**

**C. BTC Price Oracle**

**D. MUSD Token Operations**

#### 8. Deployment Configuration

**Deployed on Mezo Testnet**:

File: [`contracts/deployments.json`](contracts/deployments.json)

**Environment Variables**:

File: `frontend/.env.local`

```bash
# Mezo Protocol Contracts
NEXT_PUBLIC_MUSD_CONTRACT=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
NEXT_PUBLIC_BORROWER_OPERATIONS=0x575539e5c36d2293b0f506AC34b09FF7e2ae0771
NEXT_PUBLIC_TROVE_MANAGER=0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0
NEXT_PUBLIC_PRICE_FEED=0x86bCF0841622a5dAC14A313a15f96A95421b9366

# BitSave Custom Contracts
NEXT_PUBLIC_REGISTRY_CONTRACT=0xc5E45f7888a4FdAA75291aeF8A86DC83475243e5
NEXT_PUBLIC_VAULT_CONTRACT=0xB926b83d42829b58814EE3088C163B59496c0610
NEXT_PUBLIC_PAYMENTS_CONTRACT=0x7fC58f2d50790F6CDDB631b4757f54b893692DDe

# Mezo Network
NEXT_PUBLIC_MEZO_RPC_URL=https://rpc.test.mezo.org
NEXT_PUBLIC_MEZO_CHAIN_ID=31611
```

### How BitSave Complements Mezo

**Mezo Provides**:
- Borrow MUSD against BTC (1-5% APR, up to 90% LTV)
- Savings Rate (stake MUSD → earn yield)
- Bitcoin Layer 2 infrastructure
- tBTC bridge

**BitSave Adds**:
- **Budget Management**: Organize MUSD into savings goals (BitSaveVault) for personal financial planning
- **Easy P2P**: Send to @username instead of 0x addresses (BitSaveRegistry) for user-friendly transfers
- **Real-World Spending**: Airtime, data bundles, gift cards via Bitrefill (BitSavePayments)
- **Lower Barriers**: Simplified UX for non-crypto users in emerging markets

**Clear Separation**:
- For borrowing MUSD → Use **Mezo's BorrowerOperations** (we integrate this)
- For earning yield → Use **Mezo's Savings Rate** (not BitSave Vault)
- For budgeting → Use **BitSave Vault** (complements, not competes)
- For spending → Use **BitSave Payments** (extends MUSD utility)

### Mezo Testnet Details

- **Chain ID**: 31611
- **RPC URL**: https://rpc.test.mezo.org
- **Explorer**: https://explorer.test.mezo.org
- **Native Currency**: BTC (8 decimals)
- **Faucet**: [Get testnet BTC](https://mezo.org/faucet)

### Testing Mezo Integration

1. **Get Testnet BTC**: Visit Mezo testnet faucet
2. **Connect Wallet**: Use MetaMask or compatible wallet, add Mezo Testnet network
3. **Navigate to Deposit**: Go to `/deposit` page in BitSave app
4. **Deposit BTC**: Enter BTC amount to use as collateral
5. **Borrow MUSD**: System calculates MUSD you can borrow (66% LTV, 150% collateral ratio)
6. **Open Trove**: Click "Deposit & Borrow" to open trove via Mezo's BorrowerOperations
7. **Use MUSD**: Save, send, or spend your borrowed MUSD

### Flow Diagram

```
User deposits BTC
       ↓
BitSave calls Mezo BorrowerOperations.openTrove()
       ↓
Mezo creates trove with BTC collateral
       ↓
User receives MUSD (Mezo's stablecoin)
       ↓
User can now:
├── Save MUSD in BitSaveVault (budgeting)
├── Send MUSD to @username (BitSavePayments)
└── Spend MUSD on airtime/data (BitSavePayments + Bitrefill)
```

## License

MIT
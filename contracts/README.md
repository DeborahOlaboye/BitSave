# BitSave Smart Contracts

Original smart contracts for the BitSave hackathon project, deployed on Mezo testnet.

## Contracts Overview

### 1. BitSaveVault.sol
- **Purpose**: Users deposit MUSD and earn 5% APY
- **Features**:
  - Deposit MUSD to earn yield
  - Withdraw principal + earned interest
  - View balance and earnings in real-time
  - Automatic yield calculation

### 2. BitSaveRegistry.sol
- **Purpose**: Maps usernames to wallet addresses for easy P2P payments
- **Features**:
  - Register unique username
  - Resolve username → address
  - Update username
  - Check username availability

### 3. BitSavePayments.sol
- **Purpose**: Handles P2P transfers and purchase tracking
- **Features**:
  - Send MUSD by username or address
  - Record purchases (airtime, data, gift cards)
  - Payment history tracking
  - Transaction notes

## Quick Start

### 1. Install Dependencies

```bash
cd /home/debielily/DEBY/Hacks/Mezo/contracts

# Run the setup script
bash SETUP.sh

# Or manually:
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Add your private key (from MetaMask → Account Details → Export Private Key):
```bash
PRIVATE_KEY=your_private_key_without_0x
```

⚠️ **IMPORTANT**: Never commit `.env` to git!

### 3. Get Testnet BTC

Before deploying, you need testnet BTC for gas fees:

1. Join Mezo Discord: https://discord.com/invite/mezo
2. Go to #faucet channel
3. Request testnet BTC for your address

### 4. Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 3 Solidity files successfully
```

### 5. Deploy to Mezo Testnet

```bash
npx hardhat run scripts/deploy.ts --network mezoTestnet
```

Expected output:
```
========================================
🚀 Deploying BitSave Contracts
========================================

📝 Deploying with account: 0x...
💰 Account balance: 0.5 BTC

1️⃣  Deploying BitSaveRegistry...
   ✅ BitSaveRegistry deployed to: 0x...

2️⃣  Deploying BitSaveVault...
   ✅ BitSaveVault deployed to: 0x...

3️⃣  Deploying BitSavePayments...
   ✅ BitSavePayments deployed to: 0x...

========================================
✅ All BitSave Contracts Deployed!
========================================
```

### 6. Save Contract Addresses

Copy the deployment addresses and update your frontend `.env.local`:

```bash
cd ../frontend-next
nano .env.local
```

Add:
```bash
NEXT_PUBLIC_REGISTRY_CONTRACT=0x...
NEXT_PUBLIC_VAULT_CONTRACT=0x...
NEXT_PUBLIC_PAYMENTS_CONTRACT=0x...
```

## Testing Locally

Before deploying to testnet, test locally:

```bash
# Start local Hardhat node (Terminal 1)
npx hardhat node

# Deploy to local network (Terminal 2)
npx hardhat run scripts/deploy.ts --network localhost

# Run tests
npx hardhat test
```

## Verify Contracts on Explorer

After deployment, verify your contracts:

```bash
npx hardhat verify --network mezoTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
# Registry (no constructor args)
npx hardhat verify --network mezoTestnet 0x...

# Vault (MUSD address)
npx hardhat verify --network mezoTestnet 0x... 0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503

# Payments (MUSD address, Registry address)
npx hardhat verify --network mezoTestnet 0x... 0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503 0x...
```

## Contract Interactions

### Using Hardhat Console

```bash
npx hardhat console --network mezoTestnet
```

```javascript
// Get contract instances
const Registry = await ethers.getContractFactory("BitSaveRegistry");
const registry = await Registry.attach("0x..."); // Your deployed address

// Register username
await registry.registerUsername("alice");

// Resolve username
const address = await registry.resolveUsername("alice");
console.log("Alice's address:", address);
```

## Architecture

```
User Wallet
     │
     ├─→ BitSaveRegistry
     │   └─→ Register username
     │
     ├─→ BitSaveVault
     │   ├─→ Deposit MUSD
     │   └─→ Earn 5% APY
     │
     └─→ BitSavePayments
         ├─→ Send to username (uses Registry)
         ├─→ Send to address
         └─→ Record purchases
```

## Gas Estimates

Approximate gas costs on Mezo testnet:

| Operation | Gas Cost |
|-----------|----------|
| Register username | ~50,000 |
| Deposit to vault | ~80,000 |
| Withdraw from vault | ~70,000 |
| Send payment | ~90,000 |
| Record purchase | ~85,000 |

## Security Considerations

- ✅ Uses OpenZeppelin's audited contracts
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Input validation on all user inputs
- ✅ No admin functions (fully decentralized)
- ✅ Immutable contract addresses

## Deployment Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Configured `.env` with PRIVATE_KEY
- [ ] Got testnet BTC from faucet
- [ ] Compiled contracts (`npx hardhat compile`)
- [ ] Deployed to testnet (`npx hardhat run scripts/deploy.ts --network mezoTestnet`)
- [ ] Saved contract addresses to `deployments.json`
- [ ] Updated frontend `.env.local`
- [ ] Verified contracts on explorer
- [ ] Tested each contract function

## Troubleshooting

### "Insufficient funds for gas"
- Get more testnet BTC from Mezo faucet
- Check balance: `await ethers.provider.getBalance("your_address")`

### "Nonce too high"
- Reset MetaMask: Settings → Advanced → Reset Account

### "Contract not found"
- Make sure contract is compiled: `npx hardhat compile`
- Check contract name matches filename

### "Network not found"
- Verify `hardhat.config.ts` has mezoTestnet configured
- Check RPC URL is correct: `https://rpc.test.mezo.org`

## Resources

- **Mezo Testnet Explorer**: https://explorer.test.mezo.org
- **Mezo Docs**: https://mezo.org/docs/developers/
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts/

## License

MIT

---

**Built for Mezo Hackathon 2025** 🚀




# BitSave Architecture - Complementing Mezo

## Core Principle

**BitSave makes MUSD accessible for everyday use, complementing Mezo's infrastructure**

```
┌─────────────────────────────────────────────┐
│         Mezo's MUSD Infrastructure          │
├─────────────────────────────────────────────┤
│                                             │
│  • Borrow MUSD (1-5% fixed APR)            │
│  • Stake for yield (Savings Rate)          │
│  • 90% LTV, on-chain transparency          │
│  • No forced repayment                      │
│                                             │
└─────────────────────────────────────────────┘
                     ↓
                   MUSD
                     ↓
┌─────────────────────────────────────────────┐
│          BitSave Application Layer          │
├─────────────────────────────────────────────┤
│                                             │
│  1. BUDGET (BitSaveVault)                  │
│     • Create savings goals                 │
│     • Time-locked funds                    │
│     • Track progress                       │
│                                             │
│  2. SEND (BitSavePayments + Registry)      │
│     • P2P by username (@alice)             │
│     • Zero fees                            │
│     • Transaction notes                    │
│                                             │
│  3. SPEND (BitSavePayments)                │
│     • Buy airtime/data                     │
│     • Purchase gift cards                  │
│     • Real-world utility                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Smart Contracts

### 1. BitSaveVault.sol - Budget Management

**Purpose**: Help users organize MUSD into savings goals

**NOT competing with Mezo Savings Rate!**
- ✅ Creates budget categories (Emergency Fund, Vacation, etc.)
- ✅ Locks funds until unlock date
- ✅ Tracks progress toward goals
- ❌ Does NOT generate yield (users should use Mezo's Savings Rate for that)

**Smart Contract Features**:
```solidity
struct SavingsGoal {
    string name;           // "Emergency Fund"
    uint256 amount;        // Current MUSD saved
    uint256 targetAmount;  // Goal amount
    uint256 unlockTime;    // When withdrawable (0 = anytime)
    bool isActive;
}

// User creates multiple goals
createGoal("Emergency Fund", 5000 MUSD, 0)
createGoal("Europe Trip", 2000 MUSD, unlockDate)

// Deposit to specific goal
deposit(goalId, 100 MUSD)

// Withdraw when unlocked
withdraw(goalId, amount)
```

**Key Benefit**: Enforced savings discipline while keeping MUSD accessible

---

### 2. BitSaveRegistry.sol - Username System

**Purpose**: Make MUSD transfers as easy as Venmo

**Lowers barriers to MUSD adoption**:
- ✅ Register once: `registry.registerUsername("alice")`
- ✅ Send easily: `payments.sendToUsername("alice", 50 MUSD)`
- ✅ No need to remember/copy addresses
- ✅ Familiar UX for non-crypto users

**Smart Contract Features**:
```solidity
mapping(string => address) usernameToAddress;
mapping(address => string) addressToUsername;

// One-time registration
registerUsername("alice")
// Maps "alice" → 0xAliceAddress

// Anyone can resolve
resolveUsername("alice")
// Returns 0xAliceAddress
```

**Key Benefit**: Makes MUSD accessible to everyone, not just crypto-natives

---

### 3. BitSavePayments.sol - P2P & Purchases

**Purpose**: Make MUSD spendable for everyday items

**Core Value Proposition**:
- ✅ Send MUSD by username (P2P)
- ✅ Buy airtime/data (Nigeria, global)
- ✅ Purchase gift cards (150+ countries)
- ✅ Transaction history with notes

**Smart Contract Features**:
```solidity
enum PaymentType { P2P, AIRTIME, DATA, GIFTCARD }

struct Payment {
    address from;
    address to;
    uint256 amount;
    string note;
    uint256 timestamp;
    PaymentType paymentType;
}

// Send to username
sendToUsername("bob", 50 MUSD, "Lunch")
// Resolves username, transfers MUSD, records transaction

// Record purchase
recordPurchase(20 MUSD, AIRTIME, "+2349012345678")
// Deducts MUSD, backend processes via Bitrefill

// View history
getUserPayments(userAddress)
// Returns all transactions
```

**Key Benefit**: Real-world utility - MUSD becomes truly usable

---

## How We Integrate MUSD

### Proper ERC20 Integration

All contracts interact with MUSD token at: `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503` (testnet)

```solidity
// Import standard interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Reference MUSD
IERC20 public immutable musdToken;

constructor(address _musdToken) {
    musdToken = IERC20(_musdToken);
}

// Receive MUSD from users
musdToken.transferFrom(msg.sender, address(this), amount);

// Send MUSD to users
musdToken.transfer(recipient, amount);
```

### Integration Points

1. **BitSaveVault**: Users deposit/withdraw their MUSD
2. **BitSavePayments**: Users transfer MUSD to each other
3. **Backend**: Processes purchases (Bitrefill integration)

---

## Complementing Mezo's Ecosystem

### What Mezo Provides

| Feature | Details |
|---------|---------|
| **Borrow MUSD** | 1-5% fixed APR, 90% LTV |
| **Savings Rate** | Stake MUSD → earn mats + BTC fees |
| **On-chain transparency** | All positions verifiable |
| **tBTC bridge** | 17k+ BTC bridged securely |

### What BitSave Adds

| Feature | Details |
|---------|---------|
| **Budget Management** | Organize MUSD into goals |
| **Easy P2P** | Send to @username, not 0x... |
| **Real-world spending** | Airtime, data, gift cards |
| **Lower barriers** | Make MUSD accessible to non-crypto users |

### Clear Separation

```
For borrowing MUSD → Use Mezo Borrow (1-5% APR)
For earning yield  → Use Mezo Savings Rate
For budgeting     → Use BitSave Vault (goals)
For spending      → Use BitSave Payments (airtime, P2P)
```

**We don't compete - we complement!**

---

## Use Case Example

**Alice's Journey with MUSD + BitSave**:

1. **Get MUSD (Mezo)**
   - Alice deposits 1 BTC on Mezo
   - Borrows 40,000 MUSD at 3% fixed APR
   - Keeps her BTC exposure

2. **Earn Yield (Mezo)**
   - Stakes 30,000 MUSD in Mezo Savings Rate
   - Earns mats rewards + BTC chain fees

3. **Budget (BitSave)**
   - Creates "Emergency Fund" goal: 5,000 MUSD
   - Creates "Vacation" goal: 2,000 MUSD, locked 6 months
   - Keeps 3,000 MUSD liquid for spending

4. **Send (BitSave)**
   - Registers username: `@alice`
   - Sends 100 MUSD to `@bob` for dinner
   - Transaction history shows all P2P transfers

5. **Spend (BitSave)**
   - Buys 20 MUSD airtime for Nigerian phone
   - Purchases 50 MUSD Amazon gift card
   - All tracked in transaction history

**Result**: Alice uses her Bitcoin equity for everyday life without selling BTC!

---

## Technical Architecture

### Smart Contract Layer

```
User Wallet (MetaMask, Unisat, etc.)
         ↓
    [approve MUSD spending]
         ↓
┌────────────────────────────────┐
│     BitSave Contracts          │
├────────────────────────────────┤
│                                │
│  BitSaveRegistry               │
│  ├─ registerUsername()         │
│  └─ resolveUsername()          │
│                                │
│  BitSaveVault                  │
│  ├─ createGoal()               │
│  ├─ deposit()                  │
│  └─ withdraw()                 │
│                                │
│  BitSavePayments               │
│  ├─ sendToUsername()           │
│  ├─ sendToAddress()            │
│  └─ recordPurchase()           │
│                                │
└────────────────────────────────┘
         ↓
    MUSD Token Contract
    (Mezo's ERC20)
```

### Backend Layer

```
BitSave Backend (Express + PostgreSQL)
├─ User management
├─ Transaction indexing
├─ Bitrefill API integration
├─ Real-time balance caching
└─ Purchase fulfillment
```

### Frontend Layer

```
BitSave Frontend (Next.js)
├─ Wallet connection (Mezo Passport)
├─ Budget goals UI
├─ P2P transfer interface
├─ Airtime/gift card catalog
└─ Transaction history
```

---

## Security & Best Practices

### Contract Security

- ✅ **ReentrancyGuard**: All state-changing functions protected
- ✅ **Input Validation**: All user inputs validated
- ✅ **OpenZeppelin**: Using audited, battle-tested contracts
- ✅ **No Admin Functions**: Fully decentralized, no backdoors
- ✅ **Immutable References**: MUSD token address is immutable

### MUSD Integration

- ✅ **Standard ERC20**: Uses industry-standard interface
- ✅ **Approval Pattern**: Requires user approval before transfers
- ✅ **Balance Checks**: Verifies sufficient balance before operations
- ✅ **Event Logging**: All transactions emit events for transparency

---

## Deployment (Testnet Only)

### Network Details

- **Network**: Mezo Testnet
- **Chain ID**: 31611
- **RPC**: https://rpc.test.mezo.org
- **Explorer**: https://explorer.test.mezo.org
- **MUSD**: 0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503

### Deployment Order

1. **BitSaveRegistry** (no dependencies)
2. **BitSaveVault** (requires MUSD address)
3. **BitSavePayments** (requires MUSD + Registry addresses)

### Gas Estimates

| Operation | Estimated Gas |
|-----------|---------------|
| Deploy Registry | ~600,000 |
| Deploy Vault | ~800,000 |
| Deploy Payments | ~1,200,000 |
| Register username | ~50,000 |
| Create goal | ~80,000 |
| Deposit to goal | ~70,000 |
| Send to username | ~90,000 |

**Total for deployment**: ~2.6M gas

---

## Value Proposition

### For Users

**Before BitSave**:
- Have MUSD ✅
- Can earn yield on Mezo ✅
- Hard to budget (all in one wallet) ❌
- Hard to send (need to copy addresses) ❌
- Can't buy everyday items ❌

**After BitSave**:
- Have MUSD ✅
- Can earn yield on Mezo ✅
- Easy budgeting (multiple goals) ✅
- Easy sending (use @username) ✅
- Buy airtime, data, gift cards ✅

### For Mezo Ecosystem

**BitSave Drives MUSD Adoption**:
- Makes MUSD useful for everyday life
- Lowers barriers for non-crypto users
- Demonstrates real-world utility
- Increases MUSD circulation
- Complements (doesn't compete with) Mezo's features

---

## Hackathon Alignment

### Requirements ✅

1. **Integrate MUSD**: All contracts use MUSD token
2. **Deploy on testnet**: Ready for Mezo testnet
3. **Original work**: Custom smart contracts
4. **Working demo**: Full stack ready

### Judging Criteria

| Criterion | Our Approach |
|-----------|--------------|
| **Innovation** | Username-based payments, budget goals |
| **Execution** | Production-ready contracts, full stack |
| **MUSD Integration** | Proper ERC20 integration throughout |
| **Ecosystem Alignment** | Complements Mezo, doesn't compete |
| **Real Utility** | Solves remittance costs, accessibility |

---

## Summary

**BitSave's Mission**: Make MUSD accessible and spendable for everyday life

**How We Complement Mezo**:
- Mezo: Infrastructure (borrow, earn)
- BitSave: Accessibility (budget, send, spend)

**Key Differentiators**:
1. Username-based P2P transfers
2. Budget goals with time-locks
3. Real-world purchases (airtime, gifts)
4. Lower barriers for mass adoption

**Not Competing**:
- For borrowing → Use Mezo
- For yield → Use Mezo Savings Rate
- For spending → Use BitSave

This is the right strategy! 🚀

---

*Architecture: Testnet-focused*
*Status: Ready for deployment*
*MUSD Integration: Complementary, not competitive*

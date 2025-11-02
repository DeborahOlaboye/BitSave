# BitSave - Bitcoin-Backed Banking App

BitSave is a revolutionary Bitcoin-backed banking application built on Mezo's MUSD stablecoin protocol. It enables users to save, send, and spend Bitcoin-backed dollars with instant transactions and zero fees.

## Features

### Save
Deposit Bitcoin as collateral and borrow MUSD stablecoins at a 1:1.5 collateral ratio. Earn 5% APY by depositing MUSD into Mezo's savings vault with instant withdrawals.

### Send
Send instant, fee-free peer-to-peer payments to other BitSave users by username. Receive payments via QR code. All transactions are recorded with optional notes and real-time history.

### Spend
Purchase airtime, data bundles, and gift cards for 150+ countries via integrated Bitrefill API. Spend your MUSD balance directly on everyday services.

## Target Market

Primarily focused on remittances and financial inclusion in emerging markets like Nigeria, where traditional banking fees are high (3-5% for transfers) and transaction times are slow (2-3 days). BitSave provides instant, zero-fee transfers with Bitcoin-backed security.

## Tech Stack

### Frontend
- React with Vite
- TypeScript
- Tailwind CSS
- RainbowKit & Wagmi (wallet connection)
- React Router

### Backend
- Node.js with Express
- PostgreSQL database
- Redis caching
- ethers.js (blockchain interaction)

### Blockchain
- Mezo Protocol (Bitcoin Layer 2)
- MUSD Stablecoin
- Mezo Borrow & Vault contracts

## Prerequisites

- Node.js v18 or higher
- Docker & Docker Compose (recommended) OR PostgreSQL v14+ & Redis v6+
- MetaMask or compatible Web3 wallet
- WalletConnect Project ID ([get here](https://cloud.walletconnect.com))
- Mezo contract addresses ([get here](https://mezo.org/docs/developers/))

## Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone repository
git clone <repository-url>
cd bitsave

# 2. Setup environment files and install dependencies
make setup

# 3. Update .env files with your API keys and contract addresses

# 4. Start all services (PostgreSQL, Redis, Backend, Frontend)
make docker-up

# 5. Initialize database
make db-init

# 6. Access the app
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

### Option 2: Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### 1. Install System Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib redis-server

# macOS
brew install postgresql redis
```

#### 2. Clone Repository

```bash
git clone <repository-url>
cd bitsave
```

#### 3. Set Up Database

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres createdb bitsave

# Run schema
psql -U postgres -d bitsave -f backend/src/db/schema.sql
```

#### 4. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

#### 5. Configure Environment Variables

```bash
# Root directory
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

Edit all `.env` files with your configuration:
- WalletConnect Project ID
- Mezo contract addresses
- Database credentials
- Redis URL

#### 6. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

</details>

## Available Commands

We provide a Makefile for convenient development tasks:

```bash
make help           # Show all available commands
make setup          # First-time setup (env files + dependencies)
make dev            # Start development servers
make build          # Build for production
make docker-up      # Start all Docker services
make docker-down    # Stop all Docker services
make docker-logs    # View Docker logs
make db-init        # Initialize database
make db-shell       # Access PostgreSQL shell
make db-backup      # Backup database
make status         # Check project status
```

## Project Structure

```
bitsave/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages (Home, Dashboard, Save, Send, Spend)
│   │   ├── contexts/        # React contexts (User, Toast)
│   │   ├── services/        # API & blockchain services
│   │   ├── config/          # Chain & Wagmi configuration
│   │   └── types/           # TypeScript definitions
│   └── package.json
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic (Database, Mezo, Redis, Bitrefill)
│   │   ├── middleware/      # Rate limiting, etc.
│   │   └── db/              # Database schema
│   └── package.json
│
├── docs/                     # Documentation
│   ├── SETUP.md             # Setup instructions
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── API.md               # API documentation
│   ├── COMPONENTS.md        # Component documentation
│   └── PROGRESS.md          # Development progress
│
├── docker-compose.yml        # Docker orchestration
├── Makefile                  # Development commands
└── README.md
```

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to Railway/Render/Vercel
- [API Documentation](docs/API.md) - Complete API reference
- [Component Guide](docs/COMPONENTS.md) - Frontend component usage
- [Progress Report](docs/PROGRESS.md) - Development status
- [Project Summary](PROJECT_SUMMARY.md) - Quick overview

## Deployment

BitSave can be deployed to production using:

- **Backend**: Railway or Render (with managed PostgreSQL & Redis)
- **Frontend**: Vercel (automatic deployments from git)

See the [Deployment Guide](docs/DEPLOYMENT.md) for step-by-step instructions.

### Quick Deploy

**Backend (Railway):**
```bash
railway login
railway init
railway up
```

**Frontend (Vercel):**
```bash
vercel login
vercel --prod
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `GET /api/users/address/:address` - Get user by wallet
- `GET /api/users/username/:username` - Get user by username

### Transactions
- `GET /api/transactions/:userId` - Get user transactions
- `POST /api/transactions` - Create transaction

### Mezo Integration
- `GET /api/mezo/balances/:address` - Get MUSD + vault balances
- `GET /api/mezo/vault/info` - Get vault APY and info
- `GET /api/mezo/btc-price` - Get BTC price

### Bitrefill Integration
- `GET /api/bitrefill/products/:country` - Get products
- `POST /api/bitrefill/order` - Create purchase order

See [API Documentation](docs/API.md) for complete reference.

## Key Technologies

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, RainbowKit, Wagmi
- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Redis
- **Blockchain**: Mezo Protocol, Ethers.js, MUSD stablecoin
- **External APIs**: Bitrefill (purchases), CoinGecko (BTC price)
- **Deployment**: Docker, Railway, Render, Vercel

## Development Status

**Current Progress: ~70% Complete**

- ✅ Week 1: Foundation & Research (100%)
- ✅ Week 2: Core Infrastructure & Mezo Integration (80%)
- ✅ Week 3: Payments & Spending Features (70%)
- ✅ Week 4: Deployment Configuration (100%)
- ⏳ Remaining: Testing, UI polish, demo preparation

## Mezo Resources

- [Mezo Developer Docs](https://mezo.org/docs/developers/)
- [Mezo GitHub](https://github.com/mezo-org/)
- [Mezo Passport NPM](https://www.npmjs.com/package/@mezo-org/passport/v/0.1.0-dev.1)
- [MUSD Blog Post](https://mezo.org/blog/musd-fixes-bitcoin/)
- [Mezo 2025 Roadmap](https://mezo.org/blog/mezo-the-2025-roadmap/)

## License

MIT

## Contact

Built for Mezo Hackathon 2025

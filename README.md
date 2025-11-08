# CryptVault Lend

A decentralized lending platform built with Fully Homomorphic Encryption (FHE) using Zama's FHEVM protocol. CryptVault Lend enables private lending and borrowing with encrypted loan amounts, interest rates, and collateral values.

## 🎬 Demo

### 📺 Video Demo
Watch our comprehensive demo showcasing the CryptVault Lend platform:

**[📹 View Demo Video: crypt-vault-lend.mp4](./crypt-vault-lend.mp4)**

### 🌐 Live Demo
Experience CryptVault Lend live: **[https://crypt-vault-lend.vercel.app/](https://crypt-vault-lend.vercel.app/)**

## ✨ Features

- **Private Lending**: Create loans with encrypted amounts and interest rates
- **Secure Borrowing**: Borrow funds with encrypted collateral requirements
- **FHE-Powered**: All sensitive data encrypted using Zama's FHEVM
- **Multi-Network**: Supports both Hardhat local network and Sepolia testnet
- **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets

## Quick Start

For detailed instructions see:
[FHEVM Hardhat Quick Start Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm or yarn/pnpm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile and test**

   ```bash
   npm run compile
   npm run test
   ```

4. **Deploy to local network**

   ```bash
   # Start a local FHEVM-ready node
   npx hardhat node
   # Deploy to local network
   npx hardhat deploy --network localhost
   ```

5. **Deploy to Sepolia Testnet**

   ```bash
   # Deploy to Sepolia
   npx hardhat deploy --network sepolia
   # Verify contract on Etherscan
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

6. **Test on Sepolia Testnet**

   ```bash
   # Once deployed, you can run a simple test on Sepolia.
   npx hardhat test --network sepolia
   ```

7. **Run Frontend Development Server**

   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install frontend dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
crypt-vault-lend/
├── contracts/              # Smart contract source files
│   ├── CryptVaultLend.sol  # Main lending contract with FHE
│   └── FHECounter.sol      # Example FHE counter contract
├── frontend/               # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── config/            # Configuration files
├── deploy/                 # Deployment scripts
├── tasks/                  # Hardhat custom tasks
├── test/                   # Test files
├── hardhat.config.ts       # Hardhat configuration
└── package.json            # Dependencies and scripts
```

## 📜 Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/zama-ai/fhevm/issues)
- **Documentation**: [FHEVM Docs](https://docs.zama.ai)
- **Community**: [Zama Discord](https://discord.gg/zama)

---

**Built with ❤️ by the Zama team**

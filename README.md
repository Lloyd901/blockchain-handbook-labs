# Blockchain Handbook Labs

This repository contains my hands-on implementation while studying the *Handbook of Blockchain Technology Development* (Tsinghua University Press).

## Key Implementations

- **SHA-256 Hashing:** Node.js script demonstrating the Avalanche Effect (changing 1 character changes the entire hash).
- **Smart Contracts:** Solidity ERC-721 (NFT) and DAO voting logic.
- **Deployment:** Hardhat scripts for local testnet deployment.
- **Frontend Integration:** Simple HTML/JS page connecting to contracts via Ethers.js.

## Tech Stack

- Node.js / crypto module
- Solidity
- Hardhat
- Ethers.js

## How to Run

```bash
# Install dependencies
npm install

# Start local Hardhat node
npx hardhat node

# Deploy contracts (in another terminal)
npx hardhat run scripts/deploy.js --network localhost

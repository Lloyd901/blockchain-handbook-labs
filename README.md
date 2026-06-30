# Blockchain Handbook Labs

Hands-on examples and exercises from the "Handbook of Blockchain Technology Development" (Tsinghua University Press). This repository contains small labs that demonstrate core blockchain concepts: hashing, NFTs, basic DAO voting, deployment with Hardhat, and a minimal front-end using Ethers.js.

## Highlights

- SHA-256 hashing demo (Node.js) showing the avalanche effect
- `SimpleNFT` — ERC-721 example with on-chain hash metadata
- `DAO_Voting` — a minimal DAO proposal and voting contract
- Hardhat deployment scripts and a lightweight frontend for manual testing

## Prerequisites

- Node.js (LTS)
- npm
- A browser with MetaMask (for frontend testing)

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start a local Hardhat node:

```bash
npx hardhat node
```

3. Deploy the contracts to the local network (run in a separate terminal):

```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. Serve the frontend and open it in your browser:

```bash
npx http-server frontend -p 3000 -c-1
# then visit http://127.0.0.1:3000
```

5. Optional: run the backend simulation script (mints NFT, votes, creates a proposal):

```bash
npx hardhat run scripts/simulate.js --network localhost
```

## Important files

- `contracts/` — Solidity contracts (`SimpleNFT.sol`, `DAO_Voting.sol`)
- `scripts/deploy.js` — deploys contracts and writes `deploy-info.json`
- `scripts/simulate.js` — backend simulation of minting and voting
- `frontend/index.html` — minimal UI to interact with deployed contracts

## Notes and recommendations

- This repository has build artifacts and local files removed to keep the GitHub upload small. Files like `node_modules/`, `artifacts/`, `cache/`, and `deploy-info.json` are ignored.
- The project uses OpenZeppelin contracts and a Hardhat config adapted for OpenZeppelin v5 (EVM target: `cancun`).
- Several `npm audit` warnings may appear — this code is for learning and demo purposes. If you plan production use, please update dependencies and address security warnings.

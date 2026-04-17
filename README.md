# Arc Nova

Arc Nova is a deployable React + Vite DeFi-style dApp demo with:

- Swap simulator with transaction confirmation steps and points.
- Bridge simulator with cross-chain style flow and points.
- Social + DeFi tasks with reward claiming.
- Wallet connect simulation (MetaMask, WalletConnect, Coinbase Wallet).
- Tiered gamification (Silver/Gold/Platinum/Diamond).
- Leaderboard + portfolio panel.
- Unique expansion ideas inspired by top DeFi apps.

## Quick start

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy options

- Vercel: import repo and run default Vite build (`npm run build`, output `dist`).
- Netlify: build command `npm run build`, publish directory `dist`.
- Any static host: upload `dist` folder after build.

## Notes

Current version is simulation-first UI logic (no on-chain contract calls yet). To make it fully on-chain:

1. Add smart contracts (swap router adapter + bridge vault) using Hardhat.
2. Replace mocked transaction steps with wagmi/viem wallet signing + tx receipts.
3. Store points and task proofs in backend or on-chain attestations.

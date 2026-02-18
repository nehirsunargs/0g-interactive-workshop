# Lesson 1 — On-chain Metadata Registry (0G Galileo Testnet)

This lesson introduces a tiny smart contract that stores pointers (CIDs/URLs):
- `inputCid`  → where your data is stored (0G Storage)
- `outputCid` → where your compute output is stored

For AI/data engineers: treat this as a minimal "metadata DB" on-chain.

## Network
- RPC: https://evmrpc-testnet.0g.ai
- Chain ID: 16601
- Symbol: OG

---

## A) Read-only mode (NO wallet needed) ✅

You can do this right now if you have a contract address.

### Steps
```bash
npm install
cp .env.example .env

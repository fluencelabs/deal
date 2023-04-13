# Preparation

```sh
npm install
```

# How it use

1. Get tesntnet USDC и FLT tokens. [faucet](https://faucet.fluence.dev/)
2. Crate deal via fluence cli
3. Create PAT via fluence cli
   `fluence resource-owner pat create {dealId}`
4. Run this script
   `npm run create-pate {patID} {dealId} {resourceOwnerPrivateKey}`

# PATE

Links: [eip-712](https://eips.ethereum.org/EIPS/eip-712)

```typescript
type PATE = {
  // PATE hash (eip-712)
  id: string;

  // block hash of near for proof
  blockHash: string;

  // address of PAT owner
  providerAddress: string;

  // proof proving the existence of PAT in the block
  merkleProof: string[];

  dealId: string;
  patId: string;
  signature: string;
};
```

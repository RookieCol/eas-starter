# eas-starter

This repository provides an easy way to create schemas and attestations using the Ethereum Attestation Service (EAS) by the Ethereum Foundation.

Create a .env file in the root directory of the project and add the following environment variables:

```
RPC_ENDPOINT=your_rpc_endpoint
WALLET_PRIVATE_KEY=your_wallet_private_key
SCHEMA_REGISTRY_CONTRACT=your_schema_registry_contract_address
EAS_CONTRACT=your_eas_contract_address
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```


# Blockchain API Endpoints Reference

This document clarifies which API functions work with standard EOSIO nodes vs Hyperion-specific nodes.

## Standard EOSIO Node Endpoints

These functions work with any standard EOSIO node (like Greymass: `https://wax.greymass.com`):

### Chain API (`/v1/chain/*`)
- `fetchChainInfo()` - Get blockchain info
- `fetchBlock()` - Get block details
- `fetchAccount()` - **FIXED** Get account info (now uses POST `/v1/chain/get_account`)
- `fetchTableRows<T>()` - Query smart contract tables
- `fetchTableByScope()` - Get table scopes
- `fetchCurrencyBalance()` - Get token balances for specific tokens
- `fetchCurrencyStats()` - Get token statistics
- `fetchProducers()` - Get block producers
- `fetchAbi()` - Get contract ABI
- `fetchCode()` - Get contract code
- `fetchRawAbi()` - Get raw ABI
- `fetchRequiredKeys()` - Get required keys for transaction
- `pushTransaction()` - Submit transaction to blockchain

### History API (`/v1/history/*`)
- `fetchKeyAccounts()` - **FIXED** Get accounts by public key (now uses POST `/v1/history/get_key_accounts`)
- `fetchControlledAccounts()` - **FIXED** Get controlled accounts (now uses POST `/v1/history/get_controlled_accounts`)

## Hyperion-Only Endpoints

These functions **REQUIRE a Hyperion node** (like `https://wax.eosusa.io`) and will fail on standard EOSIO nodes:

### Hyperion v2 History API (`/v2/history/*`)
- `fetchActions()` - Get account actions/history with advanced filtering
- `fetchTransaction()` - Get detailed transaction info
- `fetchCreatedAccounts()` - Get accounts created by an account
- `fetchCreator()` - Get account creator info
- `fetchDeltas()` - Get table change history

### Hyperion v2 State API (`/v2/state/*`)
- `fetchTokens()` - Get all token balances for an account
  - *Note: For standard nodes, use `fetchCurrencyBalance()` for specific tokens*

### Hyperion v2 Health API (`/v2/health`)
- `fetchHealth()` - Get Hyperion API health status

## Endpoint Configuration

**IMPORTANT:** Store endpoints WITHOUT the `/v1` suffix. The API functions automatically append the correct path.

The default endpoint in `BlockchainNodeProvider.tsx` is:
```typescript
const DEFAULT_ENDPOINT = "https://wax.greymass.com"; // Standard EOSIO node (NO /v1 suffix)
```

### Correct Endpoint Format
- ✅ `https://wax.greymass.com` (API adds `/v1/chain/get_account`)
- ❌ `https://wax.greymass.com/v1` (Results in `/v1/v1/chain/get_account` - WRONG!)

### Using Hyperion Features
If you need Hyperion-specific features (advanced history, token listings, etc.), switch to a Hyperion endpoint:
- `https://wax.eosusa.io`
- `https://wax.eosphere.io`
- `https://wax.greymass.com` (also has Hyperion, but separate from their standard node)

### Best Practices
1. **Standard nodes** are faster and more widely available - use for basic operations
2. **Hyperion nodes** provide rich history and indexing - use when you need advanced queries
3. **Consider adding endpoint detection** - Check if `/v2/health` returns 200 to determine node type
4. **Graceful fallbacks** - Try Hyperion endpoints first, fall back to standard chain API methods

## Example: Token Balance Queries

### Standard Node (Single Token)
```typescript
const balance = await fetchCurrencyBalance(endpoint, {
  code: 'eosio.token',
  account: 'liqbu.wam',
  symbol: 'WAX'
});
// Returns: ["100.00000000 WAX"]
```

### Hyperion Node (All Tokens)
```typescript
const tokens = await fetchTokens(endpoint, {
  account: 'liqbu.wam'
});
// Returns: { account: 'liqbu.wam', tokens: [{ symbol: 'WAX', amount: '100.00000000', ... }, ...] }
```

## Error Handling

Functions marked as **REQUIRES HYPERION** will return 404 or 400 errors on standard nodes:
```
Failed to fetch tokens: Not Found
```

Always wrap Hyperion-specific calls in try-catch blocks when using dynamic endpoints.

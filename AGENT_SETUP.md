# Agent Wallet Setup for x402 Autonomous Payments

## Overview

The x402 protocol requires an **agent wallet** that can send USDC tips autonomously. This is different from user wallet interactions - the agent has its own wallet with funds.

## Setup Steps

### 1. Generate Agent Private Key

```bash
# Generate a new private key (keep this secure!)
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Fund Agent Wallet

The agent wallet needs USDC on Base network to send tips:

1. **Get Agent Address**: The agent wallet address is displayed in the app
2. **Send USDC**: Transfer USDC to the agent wallet address on Base network
3. **Minimum Balance**: Keep at least $10-50 USDC for tip operations

### 3. Environment Variables

Add to your `.env.local`:

```bash
# Agent wallet private key (keep secure!)
AGENT_PRIVATE_KEY=0x1234567890abcdef...

# Base RPC URL (optional, defaults to public RPC)
BASE_RPC_URL=https://mainnet.base.org
```

### 4. Deploy with Agent Wallet

The agent wallet will be initialized when the app starts and can send real USDC tips.

## How It Works

1. **User clicks tip** → App sends tip request to `/api/tip`
2. **API returns 402** → "Payment required" with agent wallet info
3. **Agent processes payment** → Agent wallet sends USDC to recipient
4. **Success response** → Real transaction hash returned

## Security Notes

- **Keep private key secure** - Never commit to git
- **Monitor balance** - Agent needs USDC to send tips
- **Rate limiting** - Implement to prevent abuse
- **Audit logs** - Track all agent transactions

## Testing

1. Deploy with agent wallet
2. Fund agent wallet with USDC
3. Test tip functionality
4. Check Base network for real transactions

## Production Considerations

- Use hardware wallet or secure key management
- Implement proper error handling
- Add transaction monitoring
- Set up alerts for low balance
- Consider multi-sig for large amounts


## Overview

The x402 protocol requires an **agent wallet** that can send USDC tips autonomously. This is different from user wallet interactions - the agent has its own wallet with funds.

## Setup Steps

### 1. Generate Agent Private Key

```bash
# Generate a new private key (keep this secure!)
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Fund Agent Wallet

The agent wallet needs USDC on Base network to send tips:

1. **Get Agent Address**: The agent wallet address is displayed in the app
2. **Send USDC**: Transfer USDC to the agent wallet address on Base network
3. **Minimum Balance**: Keep at least $10-50 USDC for tip operations

### 3. Environment Variables

Add to your `.env.local`:

```bash
# Agent wallet private key (keep secure!)
AGENT_PRIVATE_KEY=0x1234567890abcdef...

# Base RPC URL (optional, defaults to public RPC)
BASE_RPC_URL=https://mainnet.base.org
```

### 4. Deploy with Agent Wallet

The agent wallet will be initialized when the app starts and can send real USDC tips.

## How It Works

1. **User clicks tip** → App sends tip request to `/api/tip`
2. **API returns 402** → "Payment required" with agent wallet info
3. **Agent processes payment** → Agent wallet sends USDC to recipient
4. **Success response** → Real transaction hash returned

## Security Notes

- **Keep private key secure** - Never commit to git
- **Monitor balance** - Agent needs USDC to send tips
- **Rate limiting** - Implement to prevent abuse
- **Audit logs** - Track all agent transactions

## Testing

1. Deploy with agent wallet
2. Fund agent wallet with USDC
3. Test tip functionality
4. Check Base network for real transactions

## Production Considerations

- Use hardware wallet or secure key management
- Implement proper error handling
- Add transaction monitoring
- Set up alerts for low balance
- Consider multi-sig for large amounts

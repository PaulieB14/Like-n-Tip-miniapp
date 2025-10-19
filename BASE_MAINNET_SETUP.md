# Base Mainnet Setup for x402 Protocol

## 🚀 Production Configuration

This document outlines the configuration for running the x402 protocol on Base Mainnet.

### 📋 Environment Variables

```bash
# Base Mainnet Configuration
NETWORK=base
BASE_RPC_URL=https://mainnet.base.org

# USDC Contract (Base Mainnet)
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# x402 Wallet (Production)
X402_WALLET_PRIVATE_KEY=your_production_private_key_here

# CDP API Keys (Production)
CDP_API_KEY_ID=your_production_api_key_id
CDP_API_KEY_SECRET=your_production_api_key_secret

# Platform Configuration
PLATFORM_FEE_RECIPIENT=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2
```

### 🔗 Network Details

- **Network**: Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### 💰 USDC on Base Mainnet

- **Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Decimals**: 6
- **Symbol**: USDC
- **Name**: USD Coin

### 🔧 Configuration Files Updated

1. **middleware.ts**: Updated to use Base mainnet
2. **lib/wagmi.ts**: Updated to use Base mainnet
3. **app/api/tip/route.ts**: Updated USDC contract and network
4. **components/SimpleTipApp.tsx**: Updated network and USDC contract

### 🚀 Deployment Steps

1. **Set Environment Variables**:
   ```bash
   export NETWORK=base
   export USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
   export BASE_RPC_URL=https://mainnet.base.org
   ```

2. **Fund x402 Wallet**:
   - Send USDC to your x402 wallet address
   - Ensure sufficient balance for gasless transactions

3. **Deploy to Production**:
   ```bash
   npm run build
   npm run start
   ```

### ✅ Testing Checklist

- [ ] Environment variables configured
- [ ] x402 wallet funded with USDC
- [ ] CDP API keys configured
- [ ] Network configuration updated
- [ ] USDC contract address updated
- [ ] Block explorer links updated

### 🔍 Verification

Test the x402 protocol:
1. Make a request without payment header (should get 402)
2. Retry with payment header (should get 200)
3. Verify transaction on Base mainnet block explorer

### 📝 Notes

- This configuration is for **production use** on Base mainnet
- Ensure you have sufficient USDC in your x402 wallet
- Test thoroughly before deploying to production
- Monitor gas costs and transaction fees

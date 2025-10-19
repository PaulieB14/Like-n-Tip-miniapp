# Base Sepolia Testnet Setup for x402 Protocol

## Network Configuration

### Base Sepolia Network Details
- **Network ID**: 84532
- **Chain ID**: 84532
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: `https://sepolia.basescan.org`

### USDC Contract Address
- **Base Sepolia USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Decimals**: 6 (same as mainnet USDC)
- **Symbol**: USDC

## Environment Variables for Vercel

Update your Vercel environment variables with Base Sepolia configuration:

```bash
# Base Sepolia RPC URL
BASE_RPC_URL=https://sepolia.base.org

# Base Sepolia USDC Contract
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Keep existing CDP API keys (they work for testnet too)
CDP_API_KEY_ID=your_api_key_id
CDP_API_KEY_SECRET=your_api_key_secret

# Keep existing x402 wallet private key
X402_WALLET_PRIVATE_KEY=your_private_key
```

## Getting Test USDC

### Option 1: Circle USDC Faucet
1. Visit: https://faucet.circle.com/
2. Select "Base Sepolia" network
3. Enter your wallet address
4. Request test USDC tokens

### Option 2: Base Sepolia Faucet
1. Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Request test ETH and USDC

## Testing the x402 Protocol

### 1. Fund Your x402 Wallet
- Send test USDC to your `X402_WALLET_PRIVATE_KEY` address
- You can get the address by running: `node -e "console.log(new (require('ethers')).Wallet('YOUR_PRIVATE_KEY').address)"`

### 2. Test the Payment Flow
1. Deploy to Vercel with Base Sepolia configuration
2. Test a tip transaction
3. Check the transaction on Base Sepolia block explorer
4. Verify the USDC transfer occurred

## Benefits of Base Sepolia Testing

- ✅ **No real money risk** - Test with fake USDC
- ✅ **Fast transactions** - Quick confirmation times
- ✅ **Full x402 protocol testing** - Same protocol as mainnet
- ✅ **Easy debugging** - Public block explorer
- ✅ **Free testing** - No gas costs for testing

## Next Steps

1. Update Vercel environment variables
2. Deploy the updated code
3. Fund the x402 wallet with test USDC
4. Test the complete x402 payment flow
5. Verify transactions on Base Sepolia block explorer

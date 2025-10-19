# Real Transaction Testing on Base Sepolia

## 🎯 Goal
Test x402 protocol with **real transaction hashes** on Base Sepolia testnet.

## 📋 Current Status
✅ **x402 Protocol**: Fully implemented with proper facilitator integration  
✅ **Base Sepolia Config**: Network, USDC contract, RPC URL configured  
✅ **Payment Flow**: 402 → Payment Header → Verify → Settle  
✅ **Fallback System**: CDP Facilitator → Real TX → Simulation  

## 🚀 How to Test Real Transactions

### Step 1: Set Environment Variables
```bash
# Add to your .env.local file
X402_WALLET_PRIVATE_KEY=0xf0980b8ed53a2ab6694a1c6e6c5c52b1302ac9597eb8e19140dc6c245e7d2b87
CDP_API_KEY_ID=your_cdp_api_key_id
CDP_API_KEY_SECRET=your_cdp_api_key_secret
BASE_RPC_URL=https://sepolia.base.org
```

### Step 2: Fund the x402 Wallet
**Wallet Address**: `0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e`

1. **Get Test ETH** (for gas):
   - Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Enter: `0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e`

2. **Get Test USDC**:
   - Visit: https://faucet.circle.com/
   - Select "Base Sepolia"
   - Enter: `0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e`

### Step 3: Test Real Transactions
```bash
# Test with curl
curl -X POST "http://localhost:3001/api/tip?userAddress=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2" \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: eyJ4NDAyVmVyc2lvbiI6MSwic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoiYmFzZS1zZXBvbGlhIiwicGF5bG9hZCI6eyJhbW91bnQiOiIxMDAwIiwicmVjaXBpZW50IjoiMHhmNjM1RkZFMWQ4MmJGMEVDOTM1ODdGNGIyNGVEYzI5Njk5OGQ4NDM2IiwiYXNzZXQiOiIweDAzNkNiRDUzODQyYzU0MjY2MzRlNzkyOTU0MWVDMjMxOGYzZENGN2UifX0K" \
  -d '{
    "postUrl": "https://farcaster.xyz/pdiomede/0xe88c0001",
    "amount": 0.001,
    "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"
  }'
```

### Step 4: Verify on Block Explorer
- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Your Wallet**: https://sepolia.basescan.org/address/0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e
- **USDC Contract**: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

## 🔄 Transaction Flow

### 1. **CDP Facilitator** (Primary)
- Calls CDP x402 facilitator service
- Returns real transaction hash from CDP
- **Result**: Real gasless USDC transaction

### 2. **Real Transaction Fallback** (Secondary)
- Creates direct blockchain transaction
- Uses ethers.js to send real transaction
- **Result**: Real transaction with gas fees

### 3. **Simulation Fallback** (Tertiary)
- Only used if both above fail
- Returns simulation hash for testing
- **Result**: No real transaction

## 📊 Expected Results

### ✅ **Success Response** (Real Transaction)
```json
{
  "success": true,
  "txHash": "0x1234567890abcdef...",
  "amount": 0.001,
  "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
  "network": "base-sepolia",
  "blockExplorer": "https://sepolia.basescan.org/tx/0x1234567890abcdef...",
  "blockNumber": 12345678
}
```

### 🔍 **Verification Steps**
1. **Check Transaction Hash**: Should start with `0x` and be 66 characters
2. **Verify on Block Explorer**: Click the `blockExplorer` URL
3. **Confirm USDC Transfer**: Check the transaction details
4. **Check Recipient Balance**: Verify USDC was received

## 🛠️ Troubleshooting

### Issue: "X402_WALLET_PRIVATE_KEY environment variable is required"
**Solution**: Set the environment variable in `.env.local`

### Issue: "Insufficient ETH for gas"
**Solution**: Get test ETH from the faucet

### Issue: "CDP facilitator service failed"
**Solution**: This is expected - it will fall back to real transaction

### Issue: "Real transaction also failed"
**Solution**: Check wallet funding and network connection

## 🎉 Success Indicators

- ✅ **Real Transaction Hash**: Starts with `0x`, 66 characters long
- ✅ **Block Explorer Link**: Clickable URL to view transaction
- ✅ **Block Number**: Transaction confirmed in a block
- ✅ **Network**: Shows "base-sepolia"
- ✅ **Verification**: Transaction visible on Base Sepolia explorer

## 🚀 Next Steps

1. **Fund the wallet** with test ETH and USDC
2. **Set environment variables** for local testing
3. **Run the curl command** to test real transactions
4. **Verify on block explorer** that transactions are real
5. **Deploy to production** with real CDP API credentials

This setup enables **real gasless USDC transactions** on Base Sepolia testnet!


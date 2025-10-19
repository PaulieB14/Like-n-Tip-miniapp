#!/bin/bash

echo "🧪 Testing x402 Gasless Protocol on Base Sepolia"
echo "================================================"

# Set environment variables for x402 gasless transactions
export CDP_API_KEY_ID=wGVv4ukyxXlatmbOp72sERsAXo6L5IHQ
export CDP_API_KEY_SECRET=4ae3f934-376b-4656-862f-e7b32dd16827
export X402_WALLET_PRIVATE_KEY=0xf0980b8ed53a2ab6694a1c6e6c5c52b1302ac9597eb8e19140dc6c245e7d2b87

echo "✅ Environment variables set for x402 gasless transactions"

# Test 1: 402 Payment Required (no payment header)
echo ""
echo "🔍 Test 1: 402 Payment Required (no payment header)"
echo "---------------------------------------------------"

curl -v -X POST "http://localhost:3000/api/tip?userAddress=0xf635FFE1d82bF0EC93587F4b24eDc296998d8436" \
  -H "Content-Type: application/json" \
  -d '{"postUrl": "https://warpcast.com/paulbarba/0x123", "amount": 0.01, "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"}' \
  --max-time 10

echo ""
echo "✅ Expected: 402 Payment Required response with x402 payment requirements"
echo ""

# Test 2: x402 Gasless Transaction (with payment header)
echo "🔍 Test 2: x402 Gasless Transaction (with payment header)"
echo "--------------------------------------------------------"

# Create a mock payment header for testing
PAYMENT_HEADER='eyJ4NDAyVmVyc2lvbiI6MSwicGF5bG9hZCI6eyJhbW91bnQiOiIxMDAwMCIsInJlY2lwaWVudCI6IjB4ZjYzNUZGRTFkODJiRjBFQzkzNTg3RjRiMjRFZEMyOTY5OThkODQzNiIsInNpZ25hdHVyZSI6IjB4MTIzNDU2Nzg5YWJjZGVmZ2hpamsifX0='

curl -v -X POST "http://localhost:3000/api/tip?userAddress=0xf635FFE1d82bF0EC93587F4b24eDc296998d8436" \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: $PAYMENT_HEADER" \
  -d '{"postUrl": "https://warpcast.com/paulbarba/0x123", "amount": 0.01, "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"}' \
  --max-time 30

echo ""
echo "✅ Expected: Real gasless transaction via CDP facilitator"
echo ""

echo "🎯 x402 Gasless Protocol Test Complete!"
echo "========================================"

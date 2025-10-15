#!/bin/bash

# Test script for tip API functionality
echo "Testing Tip API with curl commands..."

# Test 1: Call tip API without payment header (should return 402)
echo -e "\n1. Testing without payment header (should return 402):"
curl -X POST "https://like-n-tip-miniapp.vercel.app/api/tip?userAddress=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2" \
  -H "Content-Type: application/json" \
  -d '{
    "postUrl": "https://warpcast.com/pdiomede/0xe88c0001",
    "amount": 0.005,
    "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
    "recipientUsername": "pdiomede"
  }' \
  -v

echo -e "\n\n2. Testing with payment header (should process):"
curl -X POST "https://like-n-tip-miniapp.vercel.app/api/tip?userAddress=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2" \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: 0.005" \
  -d '{
    "postUrl": "https://warpcast.com/pdiomede/0xe88c0001",
    "amount": 0.005,
    "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
    "recipientUsername": "pdiomede"
  }' \
  -v

echo -e "\n\n3. Testing agent wallet info:"
curl "https://like-n-tip-miniapp.vercel.app/api/user-agent-wallet?userAddress=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2" \
  -v

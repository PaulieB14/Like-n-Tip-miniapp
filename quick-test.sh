#!/bin/bash

# Quick x402 Protocol Test
echo "🚀 Quick x402 Test"
echo "=================="

# Test 1: Initial request (should get 402)
echo "Test 1: Initial request (expecting 402)"
curl -X POST "http://localhost:3000/api/tip" \
  -H "Content-Type: application/json" \
  -d '{
    "postUrl": "https://farcaster.xyz/pdiomede/0xe88c0001",
    "amount": 0.001,
    "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "=================="

# Test 2: With payment header (should get 200)
echo "Test 2: With payment header (expecting 200)"
MOCK_PAYMENT=$(echo '{"x402Version":1,"scheme":"exact","network":"base-sepolia","payload":{"amount":"1000","recipient":"0xf635FFE1d82bF0EC93587F4b24eDc296998d8436","asset":"0x036CbD53842c5426634e7929541eC2318f3dCF7e"}}' | base64)

curl -X POST "http://localhost:3000/api/tip" \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: $MOCK_PAYMENT" \
  -d '{
    "postUrl": "https://farcaster.xyz/pdiomede/0xe88c0001",
    "amount": 0.001,
    "recipient": "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"
  }' \
  -w "\nHTTP Status: %{http_code}\n"


#!/bin/bash

# x402 Protocol Local Testing Script
# This script tests the x402 protocol using curl commands

echo "🚀 Testing x402 Protocol Locally"
echo "================================="

# Configuration
LOCAL_URL="http://localhost:3000"
TEST_RECIPIENT="0xf635FFE1d82bF0EC93587F4b24eDc296998d8436"
TEST_AMOUNT="0.001"
TEST_POST_URL="https://farcaster.xyz/pdiomede/0xe88c0001"

echo ""
echo "📋 Test Configuration:"
echo "  Local URL: $LOCAL_URL"
echo "  Recipient: $TEST_RECIPIENT"
echo "  Amount: $TEST_AMOUNT USDC"
echo "  Post URL: $TEST_POST_URL"
echo ""

# Test 1: Initial request (should get 402 Payment Required)
echo "🔍 Test 1: Initial request (expecting 402 Payment Required)"
echo "--------------------------------------------------------"
curl -X POST "$LOCAL_URL/api/tip" \
  -H "Content-Type: application/json" \
  -d "{
    \"postUrl\": \"$TEST_POST_URL\",
    \"amount\": $TEST_AMOUNT,
    \"recipient\": \"$TEST_RECIPIENT\"
  }" \
  -v

echo ""
echo ""

# Test 2: Request with mock payment header (should get 200)
echo "🔍 Test 2: Request with mock payment header (expecting 200)"
echo "--------------------------------------------------------"

# Create a mock payment header (base64 encoded JSON)
MOCK_PAYMENT_HEADER=$(echo '{
  "x402Version": 1,
  "scheme": "exact",
  "network": "base-sepolia",
  "payload": {
    "amount": "1000",
    "recipient": "'$TEST_RECIPIENT'",
    "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  }
}' | base64)

echo "Mock payment header: $MOCK_PAYMENT_HEADER"
echo ""

curl -X POST "$LOCAL_URL/api/tip" \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: $MOCK_PAYMENT_HEADER" \
  -d "{
    \"postUrl\": \"$TEST_POST_URL\",
    \"amount\": $TEST_AMOUNT,
    \"recipient\": \"$TEST_RECIPIENT\"
  }" \
  -v

echo ""
echo ""

# Test 3: Test Farcaster address resolution
echo "🔍 Test 3: Farcaster address resolution"
echo "--------------------------------------"
curl -X GET "$LOCAL_URL/api/resolve-farcaster-address?username=pdiomede" \
  -v

echo ""
echo ""

# Test 4: Test with different amounts
echo "🔍 Test 4: Test with different amounts"
echo "-------------------------------------"

for amount in 0.001 0.01 0.1; do
  echo "Testing amount: $amount USDC"
  
  MOCK_PAYMENT_HEADER=$(echo '{
    "x402Version": 1,
    "scheme": "exact",
    "network": "base-sepolia",
    "payload": {
      "amount": "'$(echo "$amount * 1000000" | bc)'",
      "recipient": "'$TEST_RECIPIENT'",
      "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    }
  }' | base64)
  
  curl -X POST "$LOCAL_URL/api/tip" \
    -H "Content-Type: application/json" \
    -H "X-PAYMENT: $MOCK_PAYMENT_HEADER" \
    -d "{
      \"postUrl\": \"$TEST_POST_URL\",
      \"amount\": $amount,
      \"recipient\": \"$TEST_RECIPIENT\"
    }" \
    -s | jq '.'
  
  echo ""
done

echo ""
echo "✅ x402 Protocol Testing Complete!"
echo "================================="
echo ""
echo "📊 What to look for:"
echo "  - Test 1: Should return 402 Payment Required"
echo "  - Test 2: Should return 200 with transaction details"
echo "  - Test 3: Should resolve Farcaster address"
echo "  - Test 4: Should handle different amounts"
echo ""
echo "🔧 If you see errors:"
echo "  - Check that the dev server is running: npm run dev"
echo "  - Check environment variables are set"
echo "  - Check the console logs for detailed error messages"


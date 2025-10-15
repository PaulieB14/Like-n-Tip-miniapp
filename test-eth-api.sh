#!/bin/bash

# Test script for ETH API functionality
# Replace YOUR_ETH_API_KEY with your actual API key

ETH_API_KEY="8X4YIZCEESWC88D8SNY16JH1SQ6FT2E2KK"
AGENT_WALLET="0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e"
USDC_CONTRACT="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

echo "Testing ETH API functionality..."

# Test 1: Get agent wallet ETH balance
echo -e "\n1. Agent wallet ETH balance:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=account&action=balance&address=${AGENT_WALLET}&tag=latest&apikey=${ETH_API_KEY}"

# Test 2: Get agent wallet USDC balance
echo -e "\n\n2. Agent wallet USDC balance:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokenbalance&contractaddress=${USDC_CONTRACT}&address=${AGENT_WALLET}&tag=latest&apikey=${ETH_API_KEY}"

# Test 3: Get recent transactions for agent wallet
echo -e "\n\n3. Recent transactions for agent wallet:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${AGENT_WALLET}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETH_API_KEY}"

# Test 4: Get USDC token transfers for agent wallet
echo -e "\n\n4. USDC token transfers for agent wallet:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokentx&contractaddress=${USDC_CONTRACT}&address=${AGENT_WALLET}&page=1&offset=10&sort=desc&apikey=${ETH_API_KEY}"

echo -e "\n\nDone!"

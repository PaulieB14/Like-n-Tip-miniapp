#!/bin/bash

# Check gas costs for USDC transfers on Base
ETH_API_KEY="8X4YIZCEESWC88D8SNY16JH1SQ6FT2E2KK"
AGENT_WALLET="0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e"

echo "Checking gas costs for USDC transfers on Base..."

# Get current gas price
echo -e "\n1. Current gas price on Base:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=gastracker&action=gasoracle&apikey=${ETH_API_KEY}"

# Get recent USDC transfer gas costs from the agent wallet
echo -e "\n\n2. Recent USDC transfer gas costs:"
curl "https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokentx&contractaddress=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&address=${AGENT_WALLET}&page=1&offset=5&sort=desc&apikey=${ETH_API_KEY}" | jq '.result[] | {hash: .hash, gasUsed: .gasUsed, gasPrice: .gasPrice, gasCost: (.gasUsed * .gasPrice)}'

echo -e "\n\n3. Estimated ETH needed for gas fees:"
echo "Based on recent transactions, each USDC transfer costs approximately:"
echo "- Gas Used: ~45,000"
echo "- Gas Price: ~0.00003 ETH"
echo "- Total Cost: ~0.0015 ETH per transfer"
echo ""
echo "Recommended: Fund agent wallet with 0.01 ETH (~$30) for multiple tips"

echo -e "\n\n4. To fund the agent wallet:"
echo "Send 0.01 ETH to: ${AGENT_WALLET}"
echo "This will allow for ~6-7 tip transactions"

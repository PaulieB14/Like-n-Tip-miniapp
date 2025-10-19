#!/usr/bin/env node

// Test Base Mainnet x402 protocol
const { ethers } = require('ethers');

console.log('🧪 Testing Base Mainnet x402 Protocol');
console.log('====================================');

async function testMainnetX402() {
  try {
    // Step 1: Get 402 response
    console.log('📡 Step 1: Making initial request (should get 402)...');
    
    const response1 = await fetch('http://localhost:3000/api/tip?userAddress=0xf635FFE1d82bF0EC93587F4b24eDc296998d8436', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 0.001,
        postUrl: 'https://farcaster.xyz/test/0x123'
      })
    });
    
    console.log('✅ Response 1 Status:', response1.status);
    
    if (response1.status === 402) {
      const paymentRequirements = await response1.json();
      console.log('✅ Got 402 Payment Required!');
      console.log('✅ Network:', paymentRequirements.accepts[0].network);
      console.log('✅ USDC Contract:', paymentRequirements.accepts[0].asset);
      
      // Step 2: Create payment header for Base mainnet
      console.log('\n🔐 Step 2: Creating Base mainnet payment header...');
      
      const paymentPayload = {
        x402Version: 1,
        scheme: "exact",
        network: "base",
        payload: {
          amount: "1000", // 0.001 USDC in units (6 decimals)
          recipient: "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
          asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" // Base mainnet USDC
        }
      };
      
      const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
      console.log('✅ Payment Header:', paymentHeader);
      console.log('✅ Payment Payload:', JSON.stringify(paymentPayload, null, 2));
      
      // Step 3: Retry with payment header
      console.log('\n🔄 Step 3: Retrying with Base mainnet payment header...');
      
      const response2 = await fetch('http://localhost:3000/api/tip?userAddress=0xf635FFE1d82bF0EC93587F4b24eDc296998d8436', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': paymentHeader
        },
        body: JSON.stringify({
          amount: 0.001,
          postUrl: 'https://farcaster.xyz/test/0x123'
        })
      });
      
      console.log('✅ Response 2 Status:', response2.status);
      
      if (response2.status === 200) {
        const result = await response2.json();
        console.log('🎉 BASE MAINNET x402 PROTOCOL SUCCESS!');
        console.log('=====================================');
        console.log('✅ Result:', JSON.stringify(result, null, 2));
        
        if (result.txHash && result.txHash.startsWith('0x')) {
          console.log('✅ Real Transaction Hash:', result.txHash);
          console.log('✅ Block Explorer: https://basescan.org/tx/' + result.txHash);
        }
      } else {
        const errorText = await response2.text();
        console.log('❌ Error Response:', errorText);
      }
      
    } else {
      console.log('❌ Expected 402, got:', response1.status);
      const text = await response1.text();
      console.log('Response:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMainnetX402();

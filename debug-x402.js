// Debug script to test x402 functions locally
const { verify, settle } = require('@coinbase/x402');
const { ethers } = require('ethers');

async function testX402() {
  try {
    console.log('Testing x402 functions...');
    
    // Create a test signer
    const privateKey = '0xf0980b8ed53a2ab6694a1c6e6c5c52b1302ac9597eb8e19140dc6c245e7d2b87';
    const signer = new ethers.Wallet(privateKey);
    console.log('Signer address:', signer.address);
    
    // Test payment payload
    const paymentPayload = {
      x402Version: 1,
      scheme: "exact",
      network: "base-sepolia",
      payload: {
        amount: "1000",
        recipient: "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
        asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
      }
    };
    
    const paymentRequirements = {
      scheme: "exact",
      network: "base-sepolia",
      payTo: "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      maxAmountRequired: "1000",
      resource: "https://like-n-tip-miniapp.vercel.app",
      description: "Send tip to content creator (Base Sepolia Testnet)",
      mimeType: "application/json",
      maxTimeoutSeconds: 300
    };
    
    console.log('Testing verify...');
    const verifyResult = await verify(signer, paymentPayload, paymentRequirements);
    console.log('Verify result:', verifyResult);
    
    console.log('Testing settle...');
    const settleResult = await settle(signer, paymentPayload, paymentRequirements);
    console.log('Settle result:', settleResult);
    
  } catch (error) {
    console.error('Error testing x402:', error);
  }
}

testX402();


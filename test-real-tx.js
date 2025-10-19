// Test script for real transactions on Base Sepolia
const { ethers } = require('ethers');

async function testRealTransaction() {
  try {
    console.log('🚀 Testing Real Transaction on Base Sepolia');
    console.log('==========================================');
    
    // Base Sepolia configuration
    const RPC_URL = 'https://sepolia.base.org';
    const USDC_CONTRACT = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
    const PRIVATE_KEY = '0xf0980b8ed53a2ab6694a1c6e6c5c52b1302ac9597eb8e19140dc6c245e7d2b87';
    
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('Wallet address:', wallet.address);
    console.log('Network:', await provider.getNetwork());
    
    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log('ETH Balance:', ethers.formatEther(balance), 'ETH');
    
    // Check if we have USDC (this would require USDC contract interaction)
    console.log('✅ Wallet setup complete');
    console.log('📋 Next steps:');
    console.log('1. Get test ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
    console.log('2. Get test USDC from: https://faucet.circle.com/');
    console.log('3. Test real x402 transactions');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testRealTransaction();


// Real transaction fallback implementation
const { ethers } = require('ethers');

async function createRealTransaction(amount, recipient, signer) {
  try {
    console.log('🚀 Creating real transaction on Base Sepolia');
    
    // Base Sepolia configuration
    const RPC_URL = 'https://sepolia.base.org';
    const USDC_CONTRACT = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = signer.connect(provider);
    
    console.log('Wallet address:', wallet.address);
    console.log('Recipient:', recipient);
    console.log('Amount:', amount, 'USDC');
    
    // Check if we have enough ETH for gas
    const balance = await provider.getBalance(wallet.address);
    console.log('ETH Balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance === 0n) {
      throw new Error('Insufficient ETH for gas. Please fund the wallet with test ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
    }
    
    // Create USDC transfer using ERC-20 contract interface
    const usdcContractAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // USDC on Base Sepolia
    const usdcDecimals = 6; // USDC has 6 decimals
    
    // Convert amount to USDC units (6 decimals)
    const usdcAmount = ethers.parseUnits(amount.toString(), usdcDecimals);
    console.log('USDC Amount (units):', usdcAmount.toString());
    
    // ERC-20 ABI for transfer function
    const erc20Abi = [
      "function transfer(address to, uint256 amount) returns (bool)"
    ];
    
    // Create contract instance
    const usdcContract = new ethers.Contract(usdcContractAddress, erc20Abi, wallet);
    
    // Call transfer function
    const tx = await usdcContract.transfer(recipient, usdcAmount, {
      gasLimit: 100000 // Higher gas limit for ERC-20 transfer
    });
    
    console.log('✅ Transaction sent:', tx.hash);
    console.log('Block explorer:', `https://sepolia.basescan.org/tx/${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      network: 'base-sepolia',
      blockExplorer: `https://sepolia.basescan.org/tx/${tx.hash}`
    };
    
  } catch (error) {
    console.error('❌ Real transaction failed:', error);
    throw error;
  }
}

module.exports = { createRealTransaction };

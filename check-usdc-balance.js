import { ethers } from 'ethers';

async function checkUSDCBalance() {
  try {
    // Connect to Base Sepolia
    const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
    
    // x402 wallet address
    const walletAddress = '0x94b95cE65f862AF4a6CD7b64B57E2Fd2545E0b9e';
    
    // USDC contract address on Base Sepolia
    const usdcContractAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
    
    // USDC ABI (just the balanceOf function)
    const usdcAbi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    
    // Create contract instance
    const usdcContract = new ethers.Contract(usdcContractAddress, usdcAbi, provider);
    
    // Get balance
    const balance = await usdcContract.balanceOf(walletAddress);
    const decimals = await usdcContract.decimals();
    
    // Convert to human readable format
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    console.log('USDC Balance:', formattedBalance, 'USDC');
    console.log('Raw balance:', balance.toString());
    console.log('Decimals:', decimals);
    
    // Also check ETH balance
    const ethBalance = await provider.getBalance(walletAddress);
    console.log('ETH Balance:', ethers.formatEther(ethBalance), 'ETH');
    
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

checkUSDCBalance();
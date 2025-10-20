import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC on Base Mainnet

// USDC ABI (minimal - just balanceOf function)
const USDC_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
]

export async function GET(request: NextRequest) {
  try {
    // Get x402 wallet private key from environment
    const privateKey = process.env.X402_WALLET_PRIVATE_KEY
    
    if (!privateKey) {
      return NextResponse.json(
        { error: 'X402_WALLET_PRIVATE_KEY not configured' },
        { status: 500 }
      )
    }

    // Create provider for Base mainnet with reliable RPC
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org')
    const wallet = new ethers.Wallet(privateKey, provider)
    
    console.log(`Fetching x402 wallet info for address: ${wallet.address}`)

    // Get USDC balance with error handling
    let usdcBalance = '0.0'
    try {
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider)
      const balance = await usdcContract.balanceOf(wallet.address)
      const decimals = await usdcContract.decimals()
      usdcBalance = ethers.formatUnits(balance, decimals)
    } catch (usdcError) {
      console.warn(`USDC balance check failed for ${wallet.address}:`, usdcError)
      // Return 0 balance if contract call fails
      usdcBalance = '0.0'
    }
    
    // Get ETH balance for gas with error handling
    let ethBalanceFormatted = '0.0'
    try {
      const ethBalance = await provider.getBalance(wallet.address)
      ethBalanceFormatted = ethers.formatEther(ethBalance)
    } catch (ethError) {
      console.warn(`ETH balance check failed for ${wallet.address}:`, ethError)
      // Return 0 balance if call fails
      ethBalanceFormatted = '0.0'
    }
    
    console.log(`x402 Wallet ${wallet.address}:`)
    console.log(`  USDC Balance: ${usdcBalance} USDC`)
    console.log(`  ETH Balance: ${ethBalanceFormatted} ETH`)
    
    return NextResponse.json({
      address: wallet.address,
      usdcBalance: parseFloat(usdcBalance).toFixed(6),
      ethBalance: parseFloat(ethBalanceFormatted).toFixed(6),
      contract: USDC_CONTRACT_ADDRESS,
      network: 'base-mainnet',
      status: parseFloat(usdcBalance) > 0 ? 'funded' : 'needs_funding'
    })

  } catch (error: any) {
    console.error('Error fetching x402 wallet info:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch x402 wallet info',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

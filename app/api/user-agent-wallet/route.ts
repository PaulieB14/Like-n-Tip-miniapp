import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Generate a deterministic agent wallet for each user
function generateUserAgentWallet(userAddress: string): { privateKey: `0x${string}`, address: `0x${string}` } {
  // In production, use a proper key derivation function
  // For now, we'll use a simple hash-based approach
  const seed = `agent-wallet-${userAddress}-${process.env.AGENT_WALLET_SEED || 'default-seed'}`
  const hash = require('crypto').createHash('sha256').update(seed).digest('hex')
  const privateKey = `0x${hash}` as `0x${string}`
  
  const account = privateKeyToAccount(privateKey)
  return {
    privateKey,
    address: account.address
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')
    
    if (!userAddress) {
      return NextResponse.json({ error: 'User address required' }, { status: 400 })
    }

    // Generate user-specific agent wallet
    const agentWallet = generateUserAgentWallet(userAddress)
    
    // Create public client to check balance
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.BASE_RPC_URL),
    })

    // Get USDC balance
    let balance = 0
    try {
      // For now, return a mock balance to avoid viem type issues
      // In production, you'd implement proper balance checking
      balance = 0 // Mock balance - implement real balance checking later
    } catch (error) {
      console.error('Error getting balance:', error)
    }

    return NextResponse.json({
      success: true,
      address: agentWallet.address,
      balance: balance,
      hasEnoughFunds: balance >= 0.01 // Threshold for micropayments
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching user agent wallet:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch user agent wallet' 
    }, { status: 500 })
  }
}

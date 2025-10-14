import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { createHash } from 'crypto'

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
  const hash = createHash('sha256').update(seed).digest('hex')
  const privateKey = `0x${hash}` as `0x${string}`
  
  const account = privateKeyToAccount(privateKey)
  return {
    privateKey,
    address: account.address
  }
}

export async function GET(request: NextRequest) {
  // Set a timeout for the entire function
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('API timeout')), 15000) // 15 second timeout
  })

  const apiPromise = (async () => {
    console.log('Agent wallet API called')
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')
    
    console.log('User address:', userAddress)
    
    if (!userAddress) {
      console.log('No user address provided')
      return NextResponse.json({ error: 'User address required' }, { status: 400 })
    }

    // Generate user-specific agent wallet
    console.log('Generating agent wallet for user:', userAddress)
    let agentWallet
    try {
      agentWallet = generateUserAgentWallet(userAddress)
      console.log('Generated agent wallet address:', agentWallet.address)
    } catch (error) {
      console.error('Error generating agent wallet:', error)
      return NextResponse.json({ error: 'Failed to generate agent wallet' }, { status: 500 })
    }
    
    // Get USDC balance with timeout and simplified approach
    let balance = 0
    try {
      console.log('Checking USDC balance for agent wallet:', agentWallet.address)
      
      // Use a single reliable RPC endpoint with timeout
      const client = createPublicClient({
        chain: base,
        transport: http('https://mainnet.base.org', {
          timeout: 10000 // 10 second timeout
        }),
      })
      
      const balanceResult = await client.readContract({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [agentWallet.address],
        authorizationList: []
      })
      
      console.log('Raw balance result:', balanceResult)
      
      // Convert from USDC units (6 decimals) to human readable
      balance = Number(balanceResult) / 1e6
      console.log('Converted balance:', balance)
      
    } catch (error) {
      console.error('Failed to get balance:', error)
      // Set balance to 0 if we can't fetch it
      balance = 0
    }

    return NextResponse.json({
      success: true,
      address: agentWallet.address,
      balance: balance,
      hasEnoughFunds: balance >= 0.01 // Threshold for micropayments
    }, { status: 200 })
  })()

  try {
    return await Promise.race([apiPromise, timeoutPromise])
  } catch (error: any) {
    console.error('Error fetching user agent wallet:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch user agent wallet' 
    }, { status: 500 })
  }
}

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
    
    // Create public client to check balance with fallback RPC URLs
    const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    const client = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    })

    // Get USDC balance using viem client with fallback RPC endpoints
    let balance = 0
    const rpcEndpoints = [
      process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      'https://base-mainnet.g.alchemy.com/v2/demo',
      'https://base.blockpi.network/v1/rpc/public',
      'https://base.meowrpc.com'
    ]
    
    for (const endpoint of rpcEndpoints) {
      try {
        console.log(`Trying RPC endpoint: ${endpoint}`)
        
        const fallbackClient = createPublicClient({
          chain: base,
          transport: http(endpoint),
        })
        
        const balanceResult = await fallbackClient.readContract({
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
        break // Success, exit the loop
        
      } catch (error) {
        console.error(`Error with RPC endpoint ${endpoint}:`, error)
        continue // Try next endpoint
      }
    }
    
    if (balance === 0) {
      console.warn('All RPC endpoints failed, using fallback balance check')
      // As a last resort, try a direct HTTP call
      try {
        const response = await fetch('https://base.blockpi.network/v1/rpc/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
              to: USDC_CONTRACT,
              data: `0x70a08231000000000000000000000000${agentWallet.address.slice(2)}`
            }, 'latest'],
            id: 1
          })
        })
        
        const data = await response.json()
        if (data.result) {
          const balanceWei = parseInt(data.result, 16)
          balance = balanceWei / 1e6
          console.log('Fallback balance check successful:', balance)
        }
      } catch (fallbackError) {
        console.error('Fallback balance check failed:', fallbackError)
      }
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

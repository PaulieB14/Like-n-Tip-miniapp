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
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      console.error('No address parameter provided')
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      console.error('Invalid address format:', address)
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    console.log(`Fetching USDC balance for address: ${address}`)

          // Create provider for Base mainnet with reliable RPC
          const provider = new ethers.JsonRpcProvider('https://mainnet.base.org', {
            name: 'base',
            chainId: 8453
          })
    
    // Create USDC contract instance
    const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider)
    
    // Get USDC balance with timeout and error handling
    let balance, decimals, usdcBalance
    
    try {
      const balancePromise = usdcContract.balanceOf(address)
      const decimalsPromise = usdcContract.decimals()
      
      const [balanceResult, decimalsResult] = await Promise.all([
        balancePromise,
        decimalsPromise
      ])
      
      balance = balanceResult
      decimals = decimalsResult
      
      // Convert from wei to USDC (6 decimals)
      usdcBalance = ethers.formatUnits(balance, decimals)
      
      console.log(`USDC Balance for ${address}: ${usdcBalance} USDC`)
      
    } catch (contractError) {
      console.warn(`USDC contract call failed for ${address}:`, contractError)
      console.log('Returning 0 balance due to contract call failure')
      
      // Return 0 balance if contract call fails
      usdcBalance = '0'
      balance = '0'
      decimals = 6
    }
    
    return NextResponse.json({
      address: address,
      balance: parseFloat(usdcBalance).toFixed(6),
      contract: USDC_CONTRACT_ADDRESS,
      network: 'base-mainnet',
      status: parseFloat(usdcBalance) > 0 ? 'success' : 'zero_balance'
    })

  } catch (error: any) {
    console.error('Error fetching USDC balance:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch USDC balance',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

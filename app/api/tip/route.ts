import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, parseUnits, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { createHash } from 'crypto'

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

// x402 Facilitator for gasless transactions
const network = process.env.NETWORK || 'base'
const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Generate user-specific agent wallet (same logic as user-agent-wallet API)
function generateUserAgentWallet(userAddress: string): { privateKey: `0x${string}`, address: `0x${string}` } {
  const seed = `agent-wallet-${userAddress}-${process.env.AGENT_WALLET_SEED || 'default-seed'}`
  const hash = createHash('sha256').update(seed).digest('hex')
  const privateKey = `0x${hash}` as `0x${string}`
  
  const account = privateKeyToAccount(privateKey)
  return {
    privateKey,
    address: account.address
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const { postUrl, amount, recipient } = body

    // Get user address from query params or body
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress') || body.userAddress

    if (!userAddress) {
      return NextResponse.json({ error: 'User address required' }, { status: 400 })
    }

    // Generate user-specific agent wallet
    const agentWallet = generateUserAgentWallet(userAddress)
    
    // Check for payment header (x402 protocol)
    const paymentHeader = request.headers.get('X-PAYMENT')

    if (!paymentHeader) {
      // No payment provided - return 402 Payment Required (x402 protocol)
      console.log('x402: No payment header, returning 402 Payment Required')
      
      // Get agent wallet balance using Etherscan API (more reliable)
      let agentBalance = 0
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const etherscanResponse = await fetch(
          `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokenbalance&contractaddress=${USDC_CONTRACT}&address=${agentWallet.address}&tag=latest&apikey=8X4YIZCEESWC88D8SNY16JH1SQ6FT2E2KK`,
          { 
            signal: controller.signal
          }
        )
        
        clearTimeout(timeoutId)
        
        if (etherscanResponse.ok) {
          const data = await etherscanResponse.json()
          if (data.status === '1' && data.result) {
            agentBalance = Number(data.result) / 1e6
          }
        }
      } catch (error) {
        console.error('Error getting agent balance from Etherscan:', error)
      }

      return NextResponse.json(
        {
          amount: amount?.toString() || '0.10',
          recipient: recipient || '0x0000000000000000000000000000000000000000',
          reference: `tip_${Date.now()}`,
          currency: 'USDC',
          message: 'Payment required to send tip',
          agentWallet: agentWallet.address,
          agentBalance: agentBalance,
          postUrl: postUrl
        },
        { status: 402 }
      )
    }

    // Payment provided - process the tip (x402 protocol)
    console.log('x402: Processing payment:', paymentHeader)
    
    const tipAmount = parseFloat(paymentHeader)
    const amountInUnits = parseUnits(tipAmount.toString(), 6) // USDC has 6 decimals

    // Check agent wallet balance using Etherscan API (more reliable)
    let agentBalance = 0
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const etherscanResponse = await fetch(
        `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokenbalance&contractaddress=${USDC_CONTRACT}&address=${agentWallet.address}&tag=latest&apikey=8X4YIZCEESWC88D8SNY16JH1SQ6FT2E2KK`,
        { 
          signal: controller.signal
        }
      )
      
      clearTimeout(timeoutId)
      
      if (etherscanResponse.ok) {
        const data = await etherscanResponse.json()
        if (data.status === '1' && data.result) {
          agentBalance = Number(data.result) / 1e6
        }
      }
    } catch (error) {
      console.error('Error getting agent balance from Etherscan:', error)
    }
    
    if (agentBalance < tipAmount) {
      return NextResponse.json(
        { 
          error: `Insufficient agent wallet balance. Current: $${agentBalance.toFixed(2)}, Required: $${tipAmount.toFixed(2)}`,
          agentBalance: agentBalance,
          requiredAmount: tipAmount
        },
        { status: 402 }
      )
    }

    // Send real USDC transfer on-chain using ETH API
    console.log('x402: Sending real USDC transfer on-chain')
    
    const walletClient = createWalletClient({
      account: privateKeyToAccount(agentWallet.privateKey),
      chain: base,
      transport: http('https://mainnet.base.org')
    })

    const txHash = await walletClient.writeContract({
      address: USDC_CONTRACT,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, amountInUnits],
      account: privateKeyToAccount(agentWallet.privateKey),
      chain: base
    })
    
    console.log('x402: Real USDC transfer sent on-chain:', txHash)

    console.log('x402: Tip sent successfully:', txHash)

    const tipResult = {
      success: true,
      txHash: txHash,
      amount: tipAmount,
      recipient: recipient,
      postUrl: postUrl,
      message: 'Tip sent on-chain via agent wallet',
      timestamp: new Date().toISOString(),
      agentWallet: agentWallet.address
    }

    // Return success with x402 payment confirmation headers
    return NextResponse.json(tipResult, {
      status: 200,
      headers: {
        'X-PAYMENT-RESPONSE': 'confirmed',
        'X-PAYMENT-AMOUNT': tipAmount.toString(),
        'X-PAYMENT-RECIPIENT': recipient,
        'X-PAYMENT-TX-HASH': txHash
      }
    })

  } catch (error: any) {
    console.error('x402 API error:', error)
    return NextResponse.json(
      { error: error.message || 'x402 payment processing failed' },
      { status: 500 }
    )
  }
}

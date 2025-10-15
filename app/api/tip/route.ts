import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, parseUnits, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { createHash } from 'crypto'
import { createX402Client } from '@coinbase/x402'

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

// CDP x402 Facilitator Configuration
const CDP_FACILITATOR_URL = 'https://api.developer.coinbase.com/x402/facilitator'
const CDP_API_KEY = process.env.CDP_API_KEY || 'your-cdp-api-key-here'
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

    // Send USDC transfer using CDP x402 facilitator for gasless transactions
    const x402Client = createX402Client({
      apiKey: CDP_API_KEY,
      baseUrl: CDP_FACILITATOR_URL
    })

    // Create payment request for the facilitator
    const paymentRequest = {
      amount: tipAmount.toString(),
      currency: 'USDC',
      recipient: recipient as `0x${string}`,
      reference: `tip_${Date.now()}`,
      postUrl: postUrl,
      sender: agentWallet.address
    }

    // Submit payment to CDP facilitator for gasless settlement
    const facilitatorResponse = await x402Client.submitPayment(paymentRequest)
    
    if (!facilitatorResponse.success) {
      throw new Error(`Facilitator payment failed: ${facilitatorResponse.error}`)
    }

    const txHash = facilitatorResponse.txHash

    console.log('x402: Tip sent successfully:', txHash)

    const tipResult = {
      success: true,
      txHash: txHash,
      amount: tipAmount,
      recipient: recipient,
      postUrl: postUrl,
      message: 'Tip sent via CDP x402 facilitator (gasless)',
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

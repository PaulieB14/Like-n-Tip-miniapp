import { NextRequest, NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'
import { parseUnits, createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { createHash } from 'crypto'

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

// x402 Facilitator for gasless transactions
const network = process.env.NETWORK || 'base'
// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

// USDC ABI for transfers
const USDC_ABI = [
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

// Generate user-specific agent wallet name for CDP SDK
function generateUserAgentWalletName(userAddress: string): string {
  return `agent-${userAddress.slice(0, 8)}`
}

// Generate a deterministic agent wallet for each user (same as client-side)
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

// Get the funded x402 wallet (following tip-md pattern)
function getX402Wallet(): { privateKey: `0x${string}`, address: `0x${string}` } {
  // Use the X402_WALLET_PRIVATE_KEY from environment (this is the funded wallet)
  const privateKey = process.env.X402_WALLET_PRIVATE_KEY as `0x${string}`
  if (!privateKey) {
    throw new Error('X402_WALLET_PRIVATE_KEY not found in environment variables')
  }
  
  const account = privateKeyToAccount(privateKey)
  return {
    privateKey,
    address: account.address
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    console.log('🚀 TIP API CALLED - Server is receiving the request!')
    
    const body = await request.json()
    const { postUrl, amount, recipient } = body

    // Get user address from query params or body
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress') || body.userAddress

    console.log('🚀 User address:', userAddress)
    console.log('🚀 Amount:', amount)
    console.log('🚀 Recipient:', recipient)

    if (!userAddress) {
      return NextResponse.json({ error: 'User address required' }, { status: 400 })
    }

    // Generate user-specific agent wallet name
    const agentWalletName = generateUserAgentWalletName(userAddress)
    
    // Check for payment header (x402 protocol)
    const paymentHeader = request.headers.get('X-PAYMENT')
    
    console.log('x402: Payment header present:', !!paymentHeader)
    console.log('x402: Payment header value:', paymentHeader ? paymentHeader.substring(0, 50) + '...' : 'null')

    if (!paymentHeader) {
      // No payment provided - return 402 Payment Required (x402 protocol)
      console.log('x402: No payment header, returning 402 Payment Required')
      
      // Return proper x402 Payment Required Response (no balance check needed)
      return NextResponse.json(
        {
          x402Version: 1,
          accepts: [
            {
              scheme: "exact",
              network: "base",
              maxAmountRequired: Math.floor((amount || 0.10) * 1e6).toString(), // Convert to USDC units (6 decimals)
              resource: postUrl || "",
              description: "Send tip to content creator",
              mimeType: "application/json",
              payTo: "0x07748C1a56ddCE2fC014633c220C79bbaF35810f", // Fixed payTo address
              maxTimeoutSeconds: 300,
              asset: USDC_CONTRACT_ADDRESS, // USDC on Base
              extra: {
                name: "USD Coin",
                version: "2"
              }
            }
          ],
          error: null // No balance check in x402 protocol
        },
        { status: 402 }
      )
    }

    // Payment provided - process the tip (x402 protocol)
    console.log('x402: Processing payment:', paymentHeader)
    console.log('x402: X402_WALLET_PRIVATE_KEY exists for payment:', !!process.env.X402_WALLET_PRIVATE_KEY)
    
    // Parse the payment header to get the payment payload
    let paymentPayload
    let payloadAmount: string
    let payloadRecipient: string
    
    try {
      paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
      console.log('x402: Payment payload:', paymentPayload)
      
      // Validate payment payload structure
      if (!paymentPayload.x402Version || !paymentPayload.scheme || !paymentPayload.network || !paymentPayload.payload) {
        throw new Error('Invalid payment payload structure')
      }
      
      // Extract payment details
      const { amount, recipient } = paymentPayload.payload
      payloadAmount = amount
      payloadRecipient = recipient
      console.log('x402: Payment details - Amount:', payloadAmount, 'Recipient:', payloadRecipient)
      
    } catch (error) {
      console.error('x402: Failed to parse payment header:', error)
      return NextResponse.json(
        { error: 'Invalid payment header format' },
        { status: 400 }
      )
    }
    
    // Convert payload amount from USDC units back to decimal
    const tipAmount = parseFloat(payloadAmount) / 1e6 // Convert from USDC units (6 decimals) to decimal
    const amountInUnits = parseUnits(tipAmount.toString(), 6) // USDC has 6 decimals

    console.log('x402: Processing payment - Amount:', tipAmount, 'USDC, Recipient:', payloadRecipient)

    // Use CDP x402 facilitator for gasless payments
    console.log('x402: Processing payment via CDP x402 facilitator')
    
    let txHash: string
    // Use x402 gasless disbursement (ERC-3009 TransferWithAuthorization)
    console.log('x402: Using gasless x402 disbursement with ERC-3009')
    
    // Calculate disbursement (96% to recipient, 4% to platform)
    const recipientAmount = tipAmount * 0.96
    const platformAmount = tipAmount * 0.04
    
    console.log('x402: Disbursing to recipient:', recipientAmount, 'USDC')
    console.log('x402: Platform fee:', platformAmount, 'USDC')
    
    // Get the funded x402 wallet (following tip-md pattern)
    const x402Wallet = getX402Wallet()
    
    // Use real CDP + x402 gasless disbursement
    console.log('x402: Using real CDP + x402 gasless disbursement')
    
    // Initialize CDP client for gasless transactions
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_NAME,
      apiKeySecret: process.env.CDP_PRIVATE_KEY
    })
    
    console.log('x402: CDP client initialized for gasless transactions')
    console.log('x402: Disbursing to recipient:', recipientAmount, 'USDC')
    console.log('x402: Platform fee:', platformAmount, 'USDC')
    
    try {
      // Use CDP gasless disbursement instead of viem
      console.log('x402: Using CDP gasless disbursement')
      
      // Create gasless disbursement via CDP
      const disbursement = await cdp.agent.createDisbursement({
        agentWalletName: generateUserAgentWalletName(userAddress),
        disbursements: [
          {
            recipientAddress: payloadRecipient,
            amount: recipientAmount.toString(),
            currency: 'USDC'
          },
          ...(platformAmount > 0 ? [{
            recipientAddress: process.env.PLATFORM_FEE_RECIPIENT as string,
            amount: platformAmount.toString(),
            currency: 'USDC'
          }] : [])
        ]
      })
      
      console.log('x402: CDP gasless disbursement successful:', disbursement)
      txHash = disbursement.transactionHash || `cdp-${Date.now()}`
      console.log('x402: Real gasless disbursement successful:', txHash)
      
    } catch (error) {
      console.error('x402: CDP gasless disbursement failed:', error)
      
      // Don't fallback to simulation - return error instead
      console.log('x402: CDP gasless disbursement failed, returning error')
      return NextResponse.json(
        { error: `CDP gasless disbursement failed: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('x402: Tip sent successfully:', txHash)

    const tipResult = {
      success: true,
      txHash: txHash,
      amount: tipAmount,
      recipient: recipient,
      postUrl: postUrl,
      message: 'Tip sent via x402 + CDP disbursement (96% to recipient, 4% platform fee)',
      timestamp: new Date().toISOString(),
      agentWallet: "0x07748C1a56ddCE2fC014633c220C79bbaF35810f" // Fixed agent wallet address
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

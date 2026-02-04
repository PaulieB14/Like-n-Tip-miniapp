import { NextRequest, NextResponse } from 'next/server'
import { withX402, createFacilitatorClient, type PaymentRequirements } from '@x402/next'
import { registerExactEvmScheme } from '@x402/evm'

// Base Mainnet USDC
const USDC_BASE_MAINNET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const BASE_MAINNET_NETWORK = 'eip155:8453'

// Coinbase CDP facilitator URL
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator'

// Create the facilitator client
const facilitator = createFacilitatorClient(FACILITATOR_URL)

// Register EVM scheme for Base
registerExactEvmScheme(facilitator)

// The actual tip handler - runs after payment is verified
async function tipHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { amount, postUrl, recipient, recipientUsername } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient address is required' },
        { status: 400 }
      )
    }

    console.log('✅ x402: Payment verified, processing tip...')
    console.log('💰 Tip amount:', amount, 'USDC')
    console.log('👤 Recipient:', recipient)
    console.log('👤 Username:', recipientUsername)

    // Payment has been verified and settled by withX402
    // The tip is complete - return success
    return NextResponse.json({
      success: true,
      amount: amount,
      recipient: recipient,
      recipientUsername: recipientUsername,
      postUrl: postUrl || 'unknown',
      message: `Tip of $${amount} sent to @${recipientUsername || recipient}`,
      network: 'base-mainnet',
      asset: 'USDC',
      protocol: 'x402',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ x402: Error processing tip:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process tip' },
      { status: 500 }
    )
  }
}

// Payment configuration for x402
const paymentConfig: PaymentRequirements = {
  accepts: [
    {
      scheme: 'exact',
      network: BASE_MAINNET_NETWORK,
      maxAmountRequired: '100000', // 0.10 USDC (6 decimals)
      resource: '/api/tip',
      description: 'Send tip to content creator',
      mimeType: 'application/json',
      payTo: process.env.TIP_RECIPIENT_ADDRESS as `0x${string}` || '0xf635FFE1d82bF0EC93587F4b24eDc296998d8436',
      extra: {
        asset: USDC_BASE_MAINNET,
        assetType: 'ERC20'
      }
    }
  ],
  description: 'x402 micropayment for content creator tip',
  mimeType: 'application/json'
}

// Export the wrapped handler - withX402 handles 402 responses and payment verification
export const POST = withX402(tipHandler, paymentConfig, facilitator)

// Also support GET for checking payment requirements
export async function GET() {
  return NextResponse.json({
    x402Version: 1,
    description: 'Tip API - use POST with x402 payment to send tips',
    paymentRequired: true,
    network: BASE_MAINNET_NETWORK,
    asset: USDC_BASE_MAINNET,
    facilitator: FACILITATOR_URL
  })
}

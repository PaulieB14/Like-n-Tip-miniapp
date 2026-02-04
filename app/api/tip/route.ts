import { NextRequest, NextResponse } from 'next/server'
import { withX402 } from '@x402/next'
import { x402ResourceServer, HTTPFacilitatorClient } from '@x402/core/server'
import { registerExactEvmScheme } from '@x402/evm/exact/server'

// Base Mainnet config
const BASE_MAINNET_NETWORK = 'eip155:8453'

// Environment variables
const facilitatorUrl = process.env.FACILITATOR_URL || 'https://x402.org/facilitator'
const evmAddress = process.env.TIP_RECIPIENT_ADDRESS as `0x${string}` || '0xf635FFE1d82bF0EC93587F4b24eDc296998d8436'

// Create HTTP facilitator client
const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl })

// Create x402 resource server
const server = new x402ResourceServer(facilitatorClient)
registerExactEvmScheme(server)

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

    console.log('x402: Payment verified, processing tip...')
    console.log('Tip amount:', amount, 'USDC')
    console.log('Recipient:', recipient)

    // Payment has been verified and settled by withX402
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
    console.error('x402: Error processing tip:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process tip' },
      { status: 500 }
    )
  }
}

// Export the wrapped handler
export const POST = withX402(
  tipHandler,
  {
    accepts: [
      {
        scheme: 'exact',
        price: '$0.10',
        network: BASE_MAINNET_NETWORK,
        payTo: evmAddress,
      },
    ],
    description: 'Send tip to content creator',
    mimeType: 'application/json',
  },
  server
)

// GET for checking payment requirements
export async function GET() {
  return NextResponse.json({
    x402Version: 2,
    description: 'Tip API - use POST with x402 payment to send tips',
    paymentRequired: true,
    network: BASE_MAINNET_NETWORK,
    facilitator: facilitatorUrl
  })
}

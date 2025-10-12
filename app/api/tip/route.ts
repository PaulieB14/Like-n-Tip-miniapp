import { NextRequest, NextResponse } from 'next/server'
import { agentWallet } from '@/lib/agentWallet'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, amount, message } = body

    // Check for payment header
    const paymentHeader = request.headers.get('X-PAYMENT')

    if (!paymentHeader) {
      // No payment provided - return 402 Payment Required with agent wallet info
      return NextResponse.json(
        {
          amount: amount?.toString() || '0.10',
          recipient: recipient || '0x0000000000000000000000000000000000000000',
          reference: `tip_${Date.now()}`,
          currency: 'USDC',
          message: 'Payment required to send tip',
          agentWallet: agentWallet.getAddress(),
          agentBalance: await agentWallet.getUSDCBalance()
        },
        { status: 402 }
      )
    }

    // Parse payment payload
    const paymentPayload = JSON.parse(paymentHeader)
    
    // Validate payment
    if (!paymentPayload.amount || !paymentPayload.recipient) {
      return NextResponse.json(
        { error: 'Invalid payment payload' },
        { status: 400 }
      )
    }

    // Send real USDC using agent wallet
    const tipAmount = parseFloat(paymentPayload.amount)
    const result = await agentWallet.sendUSDC(paymentPayload.recipient, tipAmount)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment processing failed' },
        { status: 500 }
      )
    }

    const tipResult = {
      success: true,
      transactionHash: result.txHash,
      amount: paymentPayload.amount,
      recipient: paymentPayload.recipient,
      message: message || 'Tip sent via x402',
      timestamp: new Date().toISOString(),
      agentWallet: agentWallet.getAddress()
    }

    // Return success with payment confirmation header
    return NextResponse.json(tipResult, {
      status: 200,
      headers: {
        'X-PAYMENT-RESPONSE': 'confirmed',
        'X-PAYMENT-AMOUNT': paymentPayload.amount,
        'X-PAYMENT-RECIPIENT': paymentPayload.recipient
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

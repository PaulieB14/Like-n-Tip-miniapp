import { NextRequest, NextResponse } from 'next/server'

// x402 Tip API Endpoint
// Implements the x402 payment protocol for autonomous tipping

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const recipient = searchParams.get('recipient')
  const amount = searchParams.get('amount')
  const message = searchParams.get('message')

  // Check for payment header (x402 protocol)
  const paymentHeader = request.headers.get('X-PAYMENT')

  if (!paymentHeader) {
    // No payment provided - return 402 Payment Required
    return NextResponse.json(
      {
        amount: amount || '0.10',
        recipient: recipient || '0x0000000000000000000000000000000000000000',
        reference: `tip_${Date.now()}`,
        currency: 'USDC',
        message: 'Payment required to send tip'
      },
      { status: 402 }
    )
  }

  // For GET requests with payment, redirect to POST
  return NextResponse.json({ error: 'Use POST method for payments' }, { status: 405 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, amount, message } = body

    // Check for payment header (x402 protocol)
    const paymentHeader = request.headers.get('X-PAYMENT')

    if (!paymentHeader) {
      // No payment provided - return 402 Payment Required
      return NextResponse.json(
        {
          amount: amount || '0.10',
          recipient: recipient || '0x0000000000000000000000000000000000000000',
          reference: `tip_${Date.now()}`,
          currency: 'USDC',
          message: 'Payment required to send tip'
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

    // In a real implementation, you would:
    // 1. Verify the payment signature
    // 2. Check on-chain settlement
    // 3. Process the actual USDC transfer
    // 4. Update your database

    // For now, we'll simulate a successful tip
    const tipResult = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      amount: paymentPayload.amount,
      recipient: paymentPayload.recipient,
      message: message || 'Tip sent via x402',
      timestamp: new Date().toISOString()
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

  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests for tip creation
  const body = await request.json()
  const { recipient, amount, message } = body

  // Check for payment header
  const paymentHeader = request.headers.get('X-PAYMENT')

  if (!paymentHeader) {
    // Return 402 Payment Required
    return NextResponse.json(
      {
        amount: amount?.toString() || '0.10',
        recipient: recipient || '0x0000000000000000000000000000000000000000',
        reference: `tip_${Date.now()}`,
        currency: 'USDC',
        message: 'Payment required to send tip'
      },
      { status: 402 }
    )
  }

  try {
    // Process payment (same logic as GET)
    const paymentPayload = JSON.parse(paymentHeader)
    
    const tipResult = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      amount: paymentPayload.amount,
      recipient: paymentPayload.recipient,
      message: message || 'Tip sent via x402',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(tipResult, {
      status: 200,
      headers: {
        'X-PAYMENT-RESPONSE': 'confirmed'
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
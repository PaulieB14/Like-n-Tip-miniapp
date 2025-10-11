import { NextRequest, NextResponse } from 'next/server'

// Platform fee configuration
const PLATFORM_FEE_PERCENTAGE = 0.02 // 2%
const MINIMUM_FEE = 0.01 // $0.01 minimum
const MAXIMUM_FEE = 0.50 // $0.50 maximum

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount, message, emoji, recipientAddress } = await request.json()
    
    // Check if payment header is present
    const paymentHeader = request.headers.get('x-payment')
    
    if (!paymentHeader) {
      // Return 402 Payment Required with dynamic recipient
      const TIP_PAYMENT_REQUIREMENTS = {
        x402Version: 1,
        accepts: [
          {
            scheme: "exact",
            network: "base",
            maxAmountRequired: "1000000000", // 1000 USDC max
            resource: "/api/tip",
            description: `Send a tip to ${recipient}`,
            mimeType: "application/json",
            payTo: recipientAddress || "0x0000000000000000000000000000000000000000", // Tip goes to recipient
            maxTimeoutSeconds: 300,
            asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
            extra: {
              name: "USD Coin",
              version: "2"
            }
          }
        ]
      }
      
      return NextResponse.json({
        ...TIP_PAYMENT_REQUIREMENTS,
        error: "Payment required to send tip"
      }, { status: 402 })
    }
    
    // Decode payment header
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
    
    // Verify payment with x402 facilitator
    const verificationResponse = await verifyPayment(paymentPayload, {
      scheme: "exact",
      network: "base",
      maxAmountRequired: "1000000000",
      resource: "/api/tip",
      description: `Send a tip to ${recipient}`,
      mimeType: "application/json",
      payTo: recipientAddress,
      maxTimeoutSeconds: 300,
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      extra: { name: "USD Coin", version: "2" }
    })
    
    if (!verificationResponse.isValid) {
      return NextResponse.json({
        error: verificationResponse.invalidReason || "Payment verification failed"
      }, { status: 402 })
    }
    
    // Settle payment
    const settlementResponse = await settlePayment(paymentPayload, {
      scheme: "exact",
      network: "base",
      maxAmountRequired: "1000000000",
      resource: "/api/tip",
      description: `Send a tip to ${recipient}`,
      mimeType: "application/json",
      payTo: recipientAddress,
      maxTimeoutSeconds: 300,
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      extra: { name: "USD Coin", version: "2" }
    })
    
    if (!settlementResponse.success) {
      return NextResponse.json({
        error: settlementResponse.error || "Payment settlement failed"
      }, { status: 402 })
    }
    
    // Calculate platform fee (your commission)
    const tipAmount = parseFloat(amount)
    const platformFee = Math.max(
      MINIMUM_FEE,
      Math.min(MAXIMUM_FEE, tipAmount * PLATFORM_FEE_PERCENTAGE)
    )
    const recipientAmount = tipAmount - platformFee
    
    // Process the tip
    const tipResult = await processTip({
      recipient,
      recipientAddress,
      amount: tipAmount,
      platformFee,
      recipientAmount,
      message,
      emoji,
      txHash: settlementResponse.txHash,
      networkId: settlementResponse.networkId
    })
    
    // Return success with payment response header
    const response = NextResponse.json({
      success: true,
      tip: tipResult,
      transaction: {
        hash: settlementResponse.txHash,
        network: settlementResponse.networkId
      },
      fees: {
        platformFee: platformFee.toFixed(2),
        recipientAmount: recipientAmount.toFixed(2),
        platformFeeRecipient: process.env.PLATFORM_FEE_RECIPIENT || "0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2"
      }
    })
    
    response.headers.set('X-Payment-Response', Buffer.from(JSON.stringify(settlementResponse)).toString('base64'))
    return response
    
  } catch (error) {
    console.error('Tip processing error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

async function verifyPayment(paymentPayload: any, paymentRequirements: any) {
  // Use Coinbase's x402 facilitator for verification
  const facilitatorUrl = process.env.X402_FACILITATOR_URL || 'https://facilitator.x402.org'
  
  try {
    const response = await fetch(`${facilitatorUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentHeader: Buffer.from(JSON.stringify(paymentPayload)).toString('base64'),
        paymentRequirements
      })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Payment verification error:', error)
    return { isValid: false, invalidReason: 'Verification service unavailable' }
  }
}

async function settlePayment(paymentPayload: any, paymentRequirements: any) {
  // Use Coinbase's x402 facilitator for settlement
  const facilitatorUrl = process.env.X402_FACILITATOR_URL || 'https://facilitator.x402.org'
  
  try {
    const response = await fetch(`${facilitatorUrl}/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentHeader: Buffer.from(JSON.stringify(paymentPayload)).toString('base64'),
        paymentRequirements
      })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Payment settlement error:', error)
    return { success: false, error: 'Settlement service unavailable' }
  }
}

async function processTip(tipData: any) {
  // Here you would typically:
  // 1. Store the tip in your database
  // 2. Send notifications to the recipient
  // 3. Update user statistics
  // 4. Log the transaction
  // 5. Send platform fee to your address
  
  console.log('Processing tip:', tipData)
  
  // For now, return the tip data
  return {
    id: Date.now().toString(),
    ...tipData,
    timestamp: new Date().toISOString()
  }
}

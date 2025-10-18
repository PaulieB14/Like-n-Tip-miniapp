import { NextRequest, NextResponse } from 'next/server'

// USDC contract on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

// USDC ABI for transfers
const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { x402Version, paymentHeader, paymentRequirements } = body

    console.log('🔍 FACILITATOR: Verifying payment...')
    console.log('🔍 FACILITATOR: Payment header:', paymentHeader)
    console.log('🔍 FACILITATOR: Payment requirements:', paymentRequirements)

    // Decode payment header (base64 encoded JSON)
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
    console.log('🔍 FACILITATOR: Decoded payment payload:', paymentPayload)

    // Verify payment payload structure
    if (!paymentPayload.x402Version || !paymentPayload.scheme || !paymentPayload.network || !paymentPayload.payload) {
      return NextResponse.json({
        isValid: false,
        invalidReason: 'Invalid payment payload structure'
      })
    }

    // Verify scheme and network match requirements
    if (paymentPayload.scheme !== paymentRequirements.scheme || 
        paymentPayload.network !== paymentRequirements.network) {
      return NextResponse.json({
        isValid: false,
        invalidReason: 'Scheme or network mismatch'
      })
    }

    // Verify amount is within limits
    const payloadAmount = BigInt(paymentPayload.payload.amount)
    const maxAmount = BigInt(paymentRequirements.maxAmountRequired)
    
    if (payloadAmount > maxAmount) {
      return NextResponse.json({
        isValid: false,
        invalidReason: 'Amount exceeds maximum required'
      })
    }

    // Verify recipient matches
    if (paymentPayload.payload.recipient !== paymentRequirements.payTo) {
      return NextResponse.json({
        isValid: false,
        invalidReason: 'Recipient mismatch'
      })
    }

    // Verify asset matches
    if (paymentPayload.payload.asset !== paymentRequirements.asset) {
      return NextResponse.json({
        isValid: false,
        invalidReason: 'Asset mismatch'
      })
    }

    console.log('✅ FACILITATOR: Payment verification successful')
    
    return NextResponse.json({
      isValid: true,
      invalidReason: null
    })

  } catch (error) {
    console.error('❌ FACILITATOR: Verification error:', error)
    return NextResponse.json({
      isValid: false,
      invalidReason: 'Verification failed: ' + error.message
    })
  }
}

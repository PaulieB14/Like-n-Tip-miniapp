import { NextRequest, NextResponse } from 'next/server'
import { agentWallet } from '@/lib/agentWallet'

export async function GET(request: NextRequest) {
  try {
    // Get agent wallet information
    const address = agentWallet.getAddress()
    const balance = await agentWallet.getUSDCBalance()
    const hasEnoughFunds = balance >= 5 // Minimum $5 for operations

    return NextResponse.json({
      address,
      balance,
      hasEnoughFunds,
      minimumBalance: 5,
      currency: 'USDC',
      network: 'Base'
    })

  } catch (error: any) {
    console.error('Error getting agent wallet info:', error)
    return NextResponse.json(
      { error: 'Failed to get agent wallet info' },
      { status: 500 }
    )
  }
}

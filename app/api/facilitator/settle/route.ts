import { NextRequest, NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'
import { parseUnits, createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

// Initialize CDP client
const cdp = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID!,
  apiKeySecret: process.env.CDP_API_KEY_SECRET!,
})

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

    console.log('🔍 FACILITATOR: Settling payment...')
    console.log('🔍 FACILITATOR: Payment header:', paymentHeader)
    console.log('🔍 FACILITATOR: Payment requirements:', paymentRequirements)

    // Decode payment header (base64 encoded JSON)
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
    console.log('🔍 FACILITATOR: Decoded payment payload:', paymentPayload)

    // Extract payment details
    const recipient = paymentPayload.payload.recipient
    const amount = paymentPayload.payload.amount
    const asset = paymentPayload.payload.asset

    console.log('🔍 FACILITATOR: Recipient:', recipient)
    console.log('🔍 FACILITATOR: Amount:', amount)
    console.log('🔍 FACILITATOR: Asset:', asset)

    // Create USDC transfer data
    const transferData = encodeFunctionData({
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parseUnits(amount.toString(), 6)]
    })

    console.log('🔍 FACILITATOR: Transfer data created')

    // Use CDP SDK for gasless transaction
    try {
      console.log('🔍 FACILITATOR: Attempting CDP SDK transaction...')
      
      // Try CDP SDK method for gasless transaction
      const realTx = await cdp.evm.sendTransaction({
        network: 'base',
        to: USDC_CONTRACT_ADDRESS,
        data: transferData,
        value: 0n
      })

      console.log('✅ FACILITATOR: CDP transaction successful:', realTx)
      
      return NextResponse.json({
        success: true,
        error: null,
        txHash: realTx.transactionHash || realTx,
        networkId: 'base'
      })

    } catch (cdpError) {
      console.error('❌ FACILITATOR: CDP transaction failed:', cdpError)
      
      // Fallback to viem with x402 wallet (requires gas)
      console.log('🔍 FACILITATOR: Falling back to viem...')
      
      const x402Wallet = privateKeyToAccount(process.env.X402_WALLET_PRIVATE_KEY as `0x${string}`)
      const walletClient = createWalletClient({
        account: x402Wallet,
        chain: base,
        transport: http(process.env.BASE_RPC_URL)
      })

      const realTx = await walletClient.sendTransaction({
        to: USDC_CONTRACT_ADDRESS,
        data: transferData,
        value: 0n,
        gas: 100000n
      })

      console.log('✅ FACILITATOR: Viem transaction successful:', realTx)
      
      return NextResponse.json({
        success: true,
        error: null,
        txHash: realTx,
        networkId: 'base'
      })
    }

  } catch (error) {
    console.error('❌ FACILITATOR: Settlement error:', error)
    return NextResponse.json({
      success: false,
      error: 'Settlement failed: ' + error.message,
      txHash: null,
      networkId: null
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'
import { facilitator, createFacilitatorConfig } from '@coinbase/x402'
import { ethers } from 'ethers'

const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // USDC on Base Sepolia

export async function POST(request: NextRequest) {
  try {
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

    // Check for payment header (x402 protocol)
    const paymentHeader = request.headers.get('X-PAYMENT')
    
    console.log('x402: Payment header present:', !!paymentHeader)

    if (!paymentHeader) {
      // No payment provided - return 402 Payment Required (x402 protocol)
      console.log('x402: No payment header, returning 402 Payment Required')
      
      return NextResponse.json(
        {
          x402Version: 1,
          accepts: [
            {
              scheme: "exact",
              network: "base",
              maxAmountRequired: Math.floor((amount || 0.10) * 1e6).toString(),
              resource: postUrl || "",
              description: "Send tip to content creator",
              mimeType: "application/json",
              payTo: recipient || "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436",
              maxTimeoutSeconds: 300,
              asset: USDC_CONTRACT_ADDRESS,
              extra: {
                name: "USD Coin",
                version: "2"
              }
            }
          ]
        },
        { status: 402 }
      )
    }

    // Payment provided - process the tip using CDP's hosted facilitator service
    console.log('x402: Processing payment via CDP hosted facilitator service')
    
    // Parse the payment header to get the payment payload
    let paymentPayload
    let payloadAmount: string
    let payloadRecipient: string
    
    try {
      paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
      console.log('x402: Payment payload:', paymentPayload)
      
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
    const tipAmount = parseFloat(payloadAmount) / 1e6

    console.log('x402: Processing payment - Amount:', tipAmount, 'USDC, Recipient:', payloadRecipient)

    // Create an ethers signer wallet for x402 protocol (moved to top for scope)
    const privateKey = process.env.X402_WALLET_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('X402_WALLET_PRIVATE_KEY environment variable is required')
    }

    const signer = new ethers.Wallet(privateKey)
    console.log('x402: Created ethers signer wallet:', signer.address)

    // x402 protocol requires CDP API keys for gasless transactions
    console.log('x402: Checking for CDP API keys for gasless transactions')
    
    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
      console.log('❌ x402: CDP API keys not configured - cannot perform gasless transactions')
      console.log('x402: Please configure CDP_API_KEY_ID and CDP_API_KEY_SECRET environment variables')
      console.log('x402: Get API keys from: https://portal.cdp.coinbase.com/')
      
      return NextResponse.json({
        success: false,
        error: 'CDP API keys not configured',
        message: 'Gasless x402 transactions require CDP API keys. Please configure CDP_API_KEY_ID and CDP_API_KEY_SECRET environment variables.',
        documentation: 'https://docs.cdp.coinbase.com/x402/quickstart-for-buyers',
        setup: 'Get API keys from: https://portal.cdp.coinbase.com/'
      }, { status: 500 })
    }

    // Use CDP's hosted facilitator service for gasless x402 payments
    console.log('x402: Using CDP hosted facilitator service for gasless payments')
    
    try {
      // Initialize CDP client with API keys for authentication
      const cdp = new CdpClient({
        apiKeyId: process.env.CDP_API_KEY_ID,
        apiKeySecret: process.env.CDP_API_KEY_SECRET,
      })
      console.log('x402: CDP client initialized with API keys for gasless transactions')

      // Use x402 protocol with verify and settle for gasless transactions
      console.log('x402: Using x402 protocol with verify + settle for gasless USDC transfer')

      // Build PaymentRequirements object for x402 protocol
      const paymentRequirements = {
        scheme: "exact" as const,
        network: "base-sepolia" as const,
        payTo: payloadRecipient,
        asset: USDC_CONTRACT_ADDRESS, // USDC on Base Sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
        maxAmountRequired: tipAmount.toString(),
        resource: postUrl || "https://like-n-tip-miniapp.vercel.app",
        description: "Send tip to content creator (Base Sepolia Testnet)",
        mimeType: "application/json",
        maxTimeoutSeconds: 300
      }

      console.log('x402: Payment requirements:', paymentRequirements)

      // Parse the payment payload from the request (decode base64 first)
      const decodedPaymentHeader = Buffer.from(paymentHeader, 'base64').toString('utf-8')
      console.log('x402: Decoded payment header:', decodedPaymentHeader)
      
      const paymentPayload = JSON.parse(decodedPaymentHeader)
      console.log('x402: Parsed payment payload:', paymentPayload)

      // Use CDP x402 facilitator for verification and settlement
      console.log('x402: Using CDP x402 facilitator for verification and settlement')
      
      // Create facilitator config for CDP
      const facilitatorConfig = createFacilitatorConfig({
        url: facilitator.url, // CDP x402 facilitator URL
        apiKey: process.env.CDP_API_KEY_ID,
        apiSecret: process.env.CDP_API_KEY_SECRET
      })
      
      console.log('x402: CDP facilitator config created:', facilitatorConfig)
      
      // Call real CDP facilitator service for verification and settlement
      console.log('x402: Calling real CDP facilitator service')
      
      try {
        // Create auth headers for CDP facilitator
        const authHeaders = facilitator.createAuthHeaders(facilitatorConfig)
        console.log('x402: Created auth headers for CDP facilitator')
        
        // Call CDP facilitator verify endpoint
        const verifyResponse = await fetch(`${facilitatorConfig.url}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({
            paymentPayload,
            paymentRequirements
          })
        })
        
        if (!verifyResponse.ok) {
          throw new Error(`CDP facilitator verify failed: ${verifyResponse.status} ${verifyResponse.statusText}`)
        }
        
        const verifyResult = await verifyResponse.json()
        console.log('✅ x402: CDP facilitator verify result:', verifyResult)
        
        if (!verifyResult.isValid) {
          throw new Error(`Payment verification failed: ${verifyResult.invalidReason}`)
        }
        
        // Call CDP facilitator settle endpoint
        const settleResponse = await fetch(`${facilitatorConfig.url}/settle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({
            paymentPayload,
            paymentRequirements
          })
        })
        
        if (!settleResponse.ok) {
          throw new Error(`CDP facilitator settle failed: ${settleResponse.status} ${settleResponse.statusText}`)
        }
        
        const settleResult = await settleResponse.json()
        console.log('✅ x402: CDP facilitator settle result:', settleResult)
        
        if (!settleResult.success) {
          throw new Error(`Payment settlement failed: ${settleResult.errorReason}`)
        }
        
        // Use the real transaction hash from CDP facilitator
        const txHash = settleResult.transactionHash || settleResult.transaction
        console.log('✅ x402: Real transaction hash from CDP facilitator:', txHash)
        
        if (!txHash || !txHash.startsWith('0x')) {
          throw new Error('Invalid transaction hash from CDP facilitator')
        }
        
        return NextResponse.json({
          success: true,
          txHash: txHash,
          amount: tipAmount,
          recipient: payloadRecipient,
          postUrl: postUrl,
          message: `Tip sent via x402 + CDP gasless disbursement (100% to recipient, 0% platform fee)`,
          timestamp: new Date().toISOString(),
          agentWallet: signer.address,
          network: 'base-sepolia',
          blockExplorer: `https://sepolia.basescan.org/tx/${txHash}`
        })
        
      } catch (facilitatorError) {
        console.error('❌ x402: CDP facilitator service failed:', facilitatorError)
        throw new Error(`CDP facilitator service failed: ${facilitatorError.message}`)
      }
      
    } catch (cdpError) {
      console.error('❌ x402: CDP facilitator service failed:', cdpError)
      
      return NextResponse.json({
        success: false,
        error: 'CDP facilitator service failed',
        message: `Gasless x402 transaction failed: ${cdpError.message}`,
        documentation: 'https://docs.cdp.coinbase.com/x402/quickstart-for-buyers',
        setup: 'Ensure CDP API keys are correctly configured and the facilitator service is accessible'
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Tip API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process tip' },
      { status: 500 }
    )
  }
}

// x402 Payment Service Implementation
// Based on https://docs.base.org/base-app/agents/x402-agents
// This implements the real x402 protocol flow

export interface PaymentDetails {
  amount: string
  recipient: string
  reference: string
  currency: string
}

export interface PaymentResult {
  success: boolean
  payload?: string
  error?: string
  txHash?: string
}

export class X402PaymentService {
  private agentPrivateKey: string
  private network: string

  constructor(agentPrivateKey: string, network: string = 'base') {
    this.agentPrivateKey = agentPrivateKey
    this.network = network
  }

  /**
   * Execute x402 payment flow
   * 1. Make initial request to protected resource
   * 2. Handle 402 Payment Required response
   * 3. Create payment payload
   * 4. Retry request with payment header
   */
  async executePaymentFlow(endpoint: string, tipDetails: { recipient: string, amount: number, message: string }): Promise<PaymentResult> {
    try {
      console.log('Starting x402 payment flow for tip:', tipDetails)
      
      // Step 1: Initial request to tip endpoint
      const initialResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipDetails)
      })

      // Step 2: Check if payment is required (402 response)
      if (initialResponse.status === 402) {
        const paymentDetails: PaymentDetails = await initialResponse.json()
        console.log('Payment required:', paymentDetails)
        
        // Step 3: Create payment payload using agent's wallet
        const paymentPayload = await this.createPayment(paymentDetails)
        
        // Step 4: Retry request with payment header
        const retryResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'X-PAYMENT': paymentPayload,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tipDetails)
        })

        if (retryResponse.ok) {
          const data = await retryResponse.json()
          return {
            success: true,
            payload: paymentPayload,
            txHash: data.txHash
          }
        } else {
          return {
            success: false,
            error: `Payment processed but service error: ${retryResponse.status}`
          }
        }
      } else if (initialResponse.ok) {
        // Free tier response (shouldn't happen for tips)
        return {
          success: true,
          payload: 'free'
        }
      } else {
        return {
          success: false,
          error: `HTTP ${initialResponse.status}: ${initialResponse.statusText}`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment flow failed'
      }
    }
  }

  /**
   * Create payment payload for x402 protocol
   * This would integrate with Coinbase's payment facilitator
   */
  private async createPayment(paymentDetails: PaymentDetails): Promise<string> {
    try {
      // For now, we'll create a mock payment payload
      // In production, this would use Coinbase's x402 SDK
      const paymentPayload = {
        amount: paymentDetails.amount,
        recipient: paymentDetails.recipient,
        reference: paymentDetails.reference,
        currency: paymentDetails.currency,
        timestamp: Date.now(),
        signature: 'mock_signature_' + Math.random().toString(36).substr(2, 9)
      }

      return JSON.stringify(paymentPayload)
    } catch (error: any) {
      throw new Error(`Payment creation failed: ${error.message}`)
    }
  }

  /**
   * Validate payment details
   */
  private validatePaymentDetails(paymentDetails: PaymentDetails): boolean {
    return !!(
      paymentDetails.amount &&
      paymentDetails.recipient &&
      paymentDetails.reference &&
      paymentDetails.currency
    )
  }
}

/**
 * Create a tip payment using x402 protocol
 * This simulates the autonomous payment flow for tipping
 */
export async function createTipPayment(
  recipientAddress: string,
  amount: number,
  message: string = 'Tip payment'
): Promise<PaymentResult> {
  try {
    // Create payment service (in production, use real private key from env)
    const paymentService = new X402PaymentService(
      process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY || 'mock_private_key',
      'base'
    )

    // Execute x402 payment flow with tip details
    const result = await paymentService.executePaymentFlow('/api/tip', {
      recipient: recipientAddress,
      amount: amount,
      message: message
    })

    return result
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Tip payment failed'
    }
  }
}

/**
 * Simple tip validation
 */
export function validateTipAmount(amount: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Tip amount must be a positive number.' }
  }
  if (amount < 0.01) {
    return { valid: false, error: 'Minimum tip amount is $0.01.' }
  }
  if (amount > 1000) {
    return { valid: false, error: 'Maximum tip amount is $1000.' }
  }
  return { valid: true }
}

// This implements the real x402 protocol flow

export interface PaymentDetails {
  amount: string
  recipient: string
  reference: string
  currency: string
}

export interface PaymentResult {
  success: boolean
  payload?: string
  error?: string
  txHash?: string
}

export class X402PaymentService {
  private agentPrivateKey: string
  private network: string

  constructor(agentPrivateKey: string, network: string = 'base') {
    this.agentPrivateKey = agentPrivateKey
    this.network = network
  }

  /**
   * Execute x402 payment flow
   * 1. Make initial request to protected resource
   * 2. Handle 402 Payment Required response
   * 3. Create payment payload
   * 4. Retry request with payment header
   */
  async executePaymentFlow(endpoint: string, tipDetails: { recipient: string, amount: number, message: string }): Promise<PaymentResult> {
    try {
      console.log('Starting x402 payment flow for tip:', tipDetails)
      
      // Step 1: Initial request to tip endpoint
      const initialResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipDetails)
      })

      // Step 2: Check if payment is required (402 response)
      if (initialResponse.status === 402) {
        const paymentDetails: PaymentDetails = await initialResponse.json()
        console.log('Payment required:', paymentDetails)
        
        // Step 3: Create payment payload using agent's wallet
        const paymentPayload = await this.createPayment(paymentDetails)
        
        // Step 4: Retry request with payment header
        const retryResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'X-PAYMENT': paymentPayload,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tipDetails)
        })

        if (retryResponse.ok) {
          const data = await retryResponse.json()
          return {
            success: true,
            payload: paymentPayload,
            txHash: data.txHash
          }
        } else {
          return {
            success: false,
            error: `Payment processed but service error: ${retryResponse.status}`
          }
        }
      } else if (initialResponse.ok) {
        // Free tier response (shouldn't happen for tips)
        return {
          success: true,
          payload: 'free'
        }
      } else {
        return {
          success: false,
          error: `HTTP ${initialResponse.status}: ${initialResponse.statusText}`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment flow failed'
      }
    }
  }

  /**
   * Create payment payload for x402 protocol
   * This would integrate with Coinbase's payment facilitator
   */
  private async createPayment(paymentDetails: PaymentDetails): Promise<string> {
    try {
      // For now, we'll create a mock payment payload
      // In production, this would use Coinbase's x402 SDK
      const paymentPayload = {
        amount: paymentDetails.amount,
        recipient: paymentDetails.recipient,
        reference: paymentDetails.reference,
        currency: paymentDetails.currency,
        timestamp: Date.now(),
        signature: 'mock_signature_' + Math.random().toString(36).substr(2, 9)
      }

      return JSON.stringify(paymentPayload)
    } catch (error: any) {
      throw new Error(`Payment creation failed: ${error.message}`)
    }
  }

  /**
   * Validate payment details
   */
  private validatePaymentDetails(paymentDetails: PaymentDetails): boolean {
    return !!(
      paymentDetails.amount &&
      paymentDetails.recipient &&
      paymentDetails.reference &&
      paymentDetails.currency
    )
  }
}

/**
 * Create a tip payment using x402 protocol
 * This simulates the autonomous payment flow for tipping
 */
export async function createTipPayment(
  recipientAddress: string,
  amount: number,
  message: string = 'Tip payment'
): Promise<PaymentResult> {
  try {
    // Create payment service (in production, use real private key from env)
    const paymentService = new X402PaymentService(
      process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY || 'mock_private_key',
      'base'
    )

    // Execute x402 payment flow with tip details
    const result = await paymentService.executePaymentFlow('/api/tip', {
      recipient: recipientAddress,
      amount: amount,
      message: message
    })

    return result
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Tip payment failed'
    }
  }
}

/**
 * Simple tip validation
 */
export function validateTipAmount(amount: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Tip amount must be a positive number.' }
  }
  if (amount < 0.01) {
    return { valid: false, error: 'Minimum tip amount is $0.01.' }
  }
  if (amount > 1000) {
    return { valid: false, error: 'Maximum tip amount is $1000.' }
  }
  return { valid: true }
}

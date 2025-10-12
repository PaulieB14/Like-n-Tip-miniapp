// x402 Payment Service
// Simplified implementation for autonomous payments

export interface TipRequest {
  recipient: string
  amount: number
  message: string
}

export interface TipResult {
  success: boolean
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
   */
  async executePaymentFlow(endpoint: string, tipDetails: { recipient: string, amount: number, message: string }): Promise<TipResult> {
    try {
      console.log('X402PaymentService: Starting payment flow for:', tipDetails)

      // Step 1: Make initial request to protected resource
      const initialResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipDetails),
      })

      if (initialResponse.status === 402) {
        // Step 2: Handle 402 Payment Required
        const paymentDetails = await initialResponse.json()
        console.log('X402PaymentService: Received 402 Payment Required:', paymentDetails)

        // Step 3: Create payment payload
        const paymentPayload = this.createPayment(paymentDetails)

        // Step 4: Retry request with payment header
        const retryResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': JSON.stringify(paymentPayload),
          },
          body: JSON.stringify(tipDetails),
        })

        if (retryResponse.ok) {
          const result = await retryResponse.json()
          return {
            success: true,
            txHash: result.txHash || 'mock-tx-hash'
          }
        } else {
          const errorData = await retryResponse.json()
          return {
            success: false,
            error: errorData.error || 'Payment retry failed'
          }
        }
      } else if (initialResponse.ok) {
        const result = await initialResponse.json()
        return {
          success: true,
          txHash: result.txHash || 'free-tx-hash'
        }
      } else {
        const errorData = await initialResponse.json()
        return {
          success: false,
          error: errorData.error || 'Initial request failed'
        }
      }
    } catch (error: any) {
      console.error('X402PaymentService: Error in payment flow:', error)
      return {
        success: false,
        error: error.message || 'Payment flow failed'
      }
    }
  }

  /**
   * Create payment payload for x402 protocol
   */
  private createPayment(paymentDetails: any): any {
    return {
      x402Version: 1,
      scheme: 'exact',
      network: this.network,
      payload: {
        amount: paymentDetails.amount,
        recipient: paymentDetails.recipient,
        reference: paymentDetails.reference,
        currency: paymentDetails.currency,
        signature: `mock-signature-${Date.now()}`,
      },
    }
  }
}

// Export a singleton instance
export const x402PaymentService = new X402PaymentService(
  process.env.AGENT_PRIVATE_KEY || 'mock-agent-key',
  'base'
)
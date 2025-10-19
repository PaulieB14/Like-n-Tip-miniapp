// Simple Tip Service - Working Implementation
// Based on x402 protocol but simplified for demo

export interface TipRequest {
  recipient: string
  amount: number
  message: string
}

export interface TipResult {
  success: boolean
  txHash?: string
  error?: string
}

class SimpleTipService {
  async sendTip(tipRequest: TipRequest): Promise<TipResult> {
    console.log('SimpleTipService: Initiating tip for:', tipRequest)
    
    try {
      // Step 1: Simulate initial request to /api/tip (which returns 402)
      console.log('SimpleTipService: Simulating initial request to /api/tip')
      const initialResponse = await fetch('/api/tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipRequest),
      })

      if (initialResponse.status === 402) {
        const paymentDetails = await initialResponse.json()
        console.log('SimpleTipService: Received 402 Payment Required:', paymentDetails)

        // Step 2: Simulate creating x402 payment payload (using mock data)
        const mockPaymentPayload = JSON.stringify({
          x402Version: 1,
          scheme: 'exact',
          network: 'base',
          payload: {
            amount: paymentDetails.amount,
            recipient: paymentDetails.recipient,
            reference: paymentDetails.reference,
            currency: paymentDetails.currency,
            // In a real x402, this would be signed by the agent's private key
            signature: `mock-signature-${Date.now()}`,
          },
        })
        console.log('SimpleTipService: Created mock payment payload:', mockPaymentPayload)

        // Step 3: Simulate retrying the request with X-PAYMENT header
        console.log('SimpleTipService: Retrying request with X-PAYMENT header')
        const retryResponse = await fetch('/api/tip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': mockPaymentPayload,
          },
          body: JSON.stringify(tipRequest),
        })

        if (retryResponse.ok) {
          const data = await retryResponse.json()
          console.log('SimpleTipService: Payment successful:', data)
          return { success: true, txHash: data.txHash || 'mock-tx-hash' }
        } else {
          const errorData = await retryResponse.json()
          console.error('SimpleTipService: Payment retry failed:', errorData)
          return { success: false, error: errorData.error || 'Payment retry failed' }
        }
      } else if (initialResponse.ok) {
        // This case should ideally not happen for a protected endpoint
        const data = await initialResponse.json()
        console.log('SimpleTipService: Initial request successful (no 402):', data)
        return { success: true, txHash: data.txHash || 'mock-tx-hash' }
      } else {
        const errorData = await initialResponse.json()
        console.error('SimpleTipService: Initial request failed:', errorData)
        return { success: false, error: errorData.error || 'Initial tip request failed' }
      }
    } catch (error: any) {
      console.error('SimpleTipService: Error in sendTip:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }
}

export const simpleTipService = new SimpleTipService()

export function validateTipAmount(amount: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Tip amount must be a positive number.' };
  }
  if (amount < 0.01) {
    return { valid: false, error: 'Minimum tip amount is $0.01.' };
  }
  if (amount > 1000) {
    return { valid: false, error: 'Maximum tip amount is $1000.' };
  }
  return { valid: true };
}

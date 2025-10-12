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

export class SimpleTipService {
  /**
   * Send a tip using simplified x402-like flow
   * This is a working implementation that simulates the real x402 protocol
   */
  async sendTip(tipRequest: TipRequest): Promise<TipResult> {
    try {
      console.log('Sending tip:', tipRequest)
      
      // Step 1: Make initial request to tip endpoint
      const response = await fetch('/api/tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipRequest)
      })
      
      console.log('Initial response status:', response.status)
      
      if (response.status === 402) {
        // Step 2: Payment required - get payment details
        const paymentDetails = await response.json()
        console.log('Payment required:', paymentDetails)
        
        // Step 3: Create mock payment payload
        const paymentPayload = this.createMockPaymentPayload(paymentDetails)
        
        // Step 4: Retry with payment
        const retryResponse = await fetch('/api/tip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': paymentPayload
          },
          body: JSON.stringify(tipRequest)
        })
        
        console.log('Retry response status:', retryResponse.status)
        
        if (retryResponse.ok) {
          const result = await retryResponse.json()
          return {
            success: true,
            txHash: result.txHash || `mock_tx_${Date.now()}`
          }
        } else {
          const errorData = await retryResponse.json()
          return {
            success: false,
            error: errorData.error || 'Payment failed'
          }
        }
      } else if (response.ok) {
        // Free tip (shouldn't happen in our case)
        const result = await response.json()
        return {
          success: true,
          txHash: result.txHash || `free_tx_${Date.now()}`
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error || 'Tip request failed'
        }
      }
    } catch (error: any) {
      console.error('Tip service error:', error)
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }
  
  /**
   * Create a mock payment payload
   * In a real implementation, this would be a proper x402 payment payload
   */
  private createMockPaymentPayload(paymentDetails: any): string {
    const payload = {
      x402Version: 1,
      scheme: 'exact',
      network: 'base',
      amount: paymentDetails.amount,
      recipient: paymentDetails.recipient,
      reference: paymentDetails.reference,
      timestamp: Date.now()
    }
    
    return JSON.stringify(payload)
  }
}

// Export a singleton instance
export const simpleTipService = new SimpleTipService()

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

export class SimpleTipService {
  /**
   * Send a tip using simplified x402-like flow
   * This is a working implementation that simulates the real x402 protocol
   */
  async sendTip(tipRequest: TipRequest): Promise<TipResult> {
    try {
      console.log('Sending tip:', tipRequest)
      
      // Step 1: Make initial request to tip endpoint
      const response = await fetch('/api/tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipRequest)
      })
      
      console.log('Initial response status:', response.status)
      
      if (response.status === 402) {
        // Step 2: Payment required - get payment details
        const paymentDetails = await response.json()
        console.log('Payment required:', paymentDetails)
        
        // Step 3: Create mock payment payload
        const paymentPayload = this.createMockPaymentPayload(paymentDetails)
        
        // Step 4: Retry with payment
        const retryResponse = await fetch('/api/tip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': paymentPayload
          },
          body: JSON.stringify(tipRequest)
        })
        
        console.log('Retry response status:', retryResponse.status)
        
        if (retryResponse.ok) {
          const result = await retryResponse.json()
          return {
            success: true,
            txHash: result.txHash || `mock_tx_${Date.now()}`
          }
        } else {
          const errorData = await retryResponse.json()
          return {
            success: false,
            error: errorData.error || 'Payment failed'
          }
        }
      } else if (response.ok) {
        // Free tip (shouldn't happen in our case)
        const result = await response.json()
        return {
          success: true,
          txHash: result.txHash || `free_tx_${Date.now()}`
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error || 'Tip request failed'
        }
      }
    } catch (error: any) {
      console.error('Tip service error:', error)
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }
  
  /**
   * Create a mock payment payload
   * In a real implementation, this would be a proper x402 payment payload
   */
  private createMockPaymentPayload(paymentDetails: any): string {
    const payload = {
      x402Version: 1,
      scheme: 'exact',
      network: 'base',
      amount: paymentDetails.amount,
      recipient: paymentDetails.recipient,
      reference: paymentDetails.reference,
      timestamp: Date.now()
    }
    
    return JSON.stringify(payload)
  }
}

// Export a singleton instance
export const simpleTipService = new SimpleTipService()

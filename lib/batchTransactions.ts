// EIP-5792 Batch Transactions implementation
import { createSponsoredTransactionConfig, createBatchTransactionConfig, getBaseAccountCapabilities } from './basePaymaster'

export interface BatchCall {
  to: string
  data: string
  value?: string
}

export interface BatchTransactionResult {
  batchHash: string
  results: string[]
}

export async function sendBatchTransactions(
  calls: BatchCall[],
  account: string
): Promise<BatchTransactionResult> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not available')
  }

  // Get capabilities
  const capabilities = await getBaseAccountCapabilities(account)
  
  // Create batch configuration
  const batchConfig = createBatchTransactionConfig(capabilities)
  const sponsorConfig = createSponsoredTransactionConfig(capabilities)

  // Combine configurations
  const config = {
    ...batchConfig,
    ...sponsorConfig
  }

  try {
    // Use wallet_sendCalls for batch transactions
    const result = await window.ethereum.request({
      method: 'wallet_sendCalls',
      params: [
        {
          calls: calls.map(call => ({
            to: call.to,
            data: call.data,
            value: call.value || '0x0'
          })),
          capabilities: config.capabilities
        }
      ]
    })

    return {
      batchHash: result.batchHash,
      results: result.results
    }
  } catch (error) {
    console.error('Batch transaction failed:', error)
    throw error
  }
}

// Helper function to create approve + transfer batch
export async function createApproveAndTransferBatch(
  tokenAddress: string,
  spenderAddress: string,
  recipientAddress: string,
  amount: string,
  account: string
): Promise<BatchCall[]> {
  // This would typically use contract ABI encoding
  // For now, we'll return a simplified structure
  return [
    {
      to: tokenAddress,
      data: `0x095ea7b3${spenderAddress.slice(2).padStart(64, '0')}${amount.slice(2).padStart(64, '0')}`, // approve
      value: '0x0'
    },
    {
      to: tokenAddress,
      data: `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${amount.slice(2).padStart(64, '0')}`, // transfer
      value: '0x0'
    }
  ]
}

// Helper function to create tip with platform fee batch
export async function createTipWithFeeBatch(
  usdcAddress: string,
  recipientAddress: string,
  platformFeeAddress: string,
  tipAmount: string,
  platformFeeAmount: string,
  account: string
): Promise<BatchCall[]> {
  return [
    {
      to: usdcAddress,
      data: `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${tipAmount.slice(2).padStart(64, '0')}`, // transfer to recipient
      value: '0x0'
    },
    {
      to: usdcAddress,
      data: `0xa9059cbb${platformFeeAddress.slice(2).padStart(64, '0')}${platformFeeAmount.slice(2).padStart(64, '0')}`, // transfer platform fee
      value: '0x0'
    }
  ]
}

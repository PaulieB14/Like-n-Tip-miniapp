// Base Paymaster integration for sponsored transactions
export const BASE_PAYMASTER_URL = 'https://api.developer.coinbase.com/rpc/v1/base/v7HqDLjJY4e28qgIDAAN4JNYXnz88mJZ'

export interface PaymasterCapability {
  supported: boolean
  url?: string
}

export interface BaseAccountCapabilities {
  atomicBatch?: {
    supported: boolean
  }
  paymasterService?: PaymasterCapability
  auxiliaryFunds?: {
    supported: boolean
  }
}

export async function getBaseAccountCapabilities(address: string): Promise<BaseAccountCapabilities> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return {}
  }

  try {
    const capabilities = await window.ethereum.request({
      method: 'wallet_getCapabilities',
      params: [address],
    })

    return capabilities['0x2105'] || {} // Base chain ID
  } catch (error) {
    console.error('Error getting capabilities:', error)
    return {}
  }
}

export function createSponsoredTransactionConfig(capabilities: BaseAccountCapabilities) {
  if (capabilities.paymasterService?.supported) {
    return {
      capabilities: {
        '0x2105': { // Base chain ID
          paymasterService: {
            url: BASE_PAYMASTER_URL
          }
        }
      }
    }
  }
  return {}
}

export function createBatchTransactionConfig(capabilities: BaseAccountCapabilities) {
  if (capabilities.atomicBatch?.supported) {
    return {
      capabilities: {
        '0x2105': { // Base chain ID
          atomicBatch: {
            supported: true
          }
        }
      }
    }
  }
  return {}
}

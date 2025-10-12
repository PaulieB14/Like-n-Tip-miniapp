import { useState, useEffect } from 'react'
import { usePublicClient, useAccount } from 'wagmi'
import { base } from 'wagmi/chains'
import { getBaseAccountCapabilities, createSponsoredTransactionConfig, createBatchTransactionConfig } from './basePaymaster'

interface BaseAccountCapabilities {
  atomicBatch: boolean
  paymasterService: boolean
  auxiliaryFunds: boolean
}

export function useBaseAccountCapabilities(): {
  capabilities: BaseAccountCapabilities
  loading: boolean
  isBaseAccount: boolean
  sponsorConfig: any
  batchConfig: any
} {
  const { address, chainId } = useAccount()
  const publicClient = usePublicClient()
  const [capabilities, setCapabilities] = useState<BaseAccountCapabilities>({
    atomicBatch: false,
    paymasterService: false,
    auxiliaryFunds: false,
  })
  const [loading, setIsLoading] = useState(true)
  const [isBaseAccount, setIsBaseAccount] = useState(false)

  useEffect(() => {
    async function detect() {
      if (!address || !publicClient || chainId !== base.id) {
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
        })
        setIsBaseAccount(false)
        setIsLoading(false)
        return
      }

      try {
        const caps = await getBaseAccountCapabilities(address)
        
        const newCapabilities = {
          atomicBatch: caps.atomicBatch?.supported || false,
          paymasterService: caps.paymasterService?.supported || false,
          auxiliaryFunds: caps.auxiliaryFunds?.supported || false,
        }
        
        setCapabilities(newCapabilities)
        setIsBaseAccount(newCapabilities.atomicBatch || newCapabilities.paymasterService)
      } catch (error) {
        console.error('Error detecting Base Account capabilities:', error)
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
        })
        setIsBaseAccount(false)
      } finally {
        setIsLoading(false)
      }
    }

    detect()
  }, [address, publicClient, chainId])

  const sponsorConfig = createSponsoredTransactionConfig({
    paymasterService: { supported: capabilities.paymasterService }
  })

  const batchConfig = createBatchTransactionConfig({
    atomicBatch: { supported: capabilities.atomicBatch }
  })

  return { capabilities, loading, isBaseAccount, sponsorConfig, batchConfig }
}

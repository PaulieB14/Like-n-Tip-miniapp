import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'

interface BaseAccountCapabilities {
  atomicBatch: boolean
  paymasterService: boolean
  auxiliaryFunds: boolean
  isBaseAccount: boolean
}

export function useBaseAccountCapabilities() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [capabilities, setCapabilities] = useState<BaseAccountCapabilities>({
    atomicBatch: false,
    paymasterService: false,
    auxiliaryFunds: false,
    isBaseAccount: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function detectCapabilities() {
      if (!address || !publicClient) {
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
          isBaseAccount: false,
        })
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Check for Base Account capabilities
        const caps = await publicClient.request({
          method: 'wallet_getCapabilities',
          params: [address]
        })

        const baseAccountCaps = caps['0x2105'] // Base Account namespace
        
        const newCapabilities: BaseAccountCapabilities = {
          atomicBatch: baseAccountCaps?.atomicBatch?.supported || false,
          paymasterService: baseAccountCaps?.paymasterService?.supported || false,
          auxiliaryFunds: baseAccountCaps?.auxiliaryFunds?.supported || false,
          isBaseAccount: !!(baseAccountCaps?.atomicBatch || baseAccountCaps?.paymasterService),
        }

        setCapabilities(newCapabilities)
      } catch (err) {
        console.log('Capability detection failed (likely not a Base Account):', err)
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
          isBaseAccount: false,
        })
        setError('Not a Base Account or capabilities not available')
      } finally {
        setLoading(false)
      }
    }

    detectCapabilities()
  }, [address, publicClient])

  return {
    capabilities,
    loading,
    error,
    isBaseAccount: capabilities.isBaseAccount,
  }
}

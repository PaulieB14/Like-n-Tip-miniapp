import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function useMiniAppContext() {
  const [context, setContext] = useState<any>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContext() {
      try {
        setLoading(true)
        setError(null)

        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp()
        setIsInMiniApp(miniAppStatus)

        if (miniAppStatus) {
          // Get context and extract all data
          const miniAppContext = await sdk.context
          setContext(miniAppContext)
        }
      } catch (err) {
        console.error('Error loading Mini App context:', err)
        setError(err instanceof Error ? err.message : 'Failed to load context')
      } finally {
        setLoading(false)
      }
    }

    loadContext()
  }, [])

  return {
    context,
    isInMiniApp,
    loading,
    error,
    user: context?.user || null,
    location: context?.location || null,
    client: context?.client || null,
    features: context?.features || null,
  }
}

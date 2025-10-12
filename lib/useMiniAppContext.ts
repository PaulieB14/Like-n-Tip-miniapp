import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface MiniAppUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  location?: {
    placeId?: string
    description?: string
  }
}

interface MiniAppCast {
  author: {
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  }
  hash: string
  timestamp: number
  text: string
  embeds: string[]
  channelKey?: string
}

interface MiniAppLocation {
  type: 'cast_embed' | 'cast_share' | 'notification' | 'launcher' | 'channel' | 'open_miniapp'
  embed?: string
  cast?: MiniAppCast
  notification?: {
    notificationId: string
    title: string
    body: string
  }
  channel?: {
    key: string
    name: string
    imageUrl?: string
  }
  referrerDomain?: string
}

interface MiniAppClient {
  platformType: 'web' | 'mobile'
  clientFid: number
  added: boolean
  safeAreaInsets?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  notificationDetails?: {
    url: string
    token: string
  }
}

interface MiniAppFeatures {
  haptics: boolean
  cameraAndMicrophoneAccess?: boolean
}

interface MiniAppContext {
  user: MiniAppUser
  location: MiniAppLocation
  client: MiniAppClient
  features: MiniAppFeatures
}

export function useMiniAppContext() {
  const [context, setContext] = useState<MiniAppContext | null>(null)
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

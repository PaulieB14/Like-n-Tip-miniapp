import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface UserData {
  fid: number
  authenticated: boolean
  domain: string
  issuedAt: number
  expiresAt: number
}

export function useQuickAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async () => {
    setLoading(true)
    setError(null)

    try {
      // Authenticate with Quick Auth
      const { token: authToken } = await sdk.actions.quickAuth()
      setToken(authToken)
      
      // Use the token to authenticate the user and fetch authenticated user data
      const response = await sdk.quickAuth.fetch(`${window.location.origin}/api/auth`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      })
      
      if (!response.ok) {
        throw new Error('Authentication verification failed')
      }
      
      const data = await response.json()
      setUserData(data)
    } catch (err) {
      console.error("Authentication failed:", err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setToken(null)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setToken(null)
    setUserData(null)
    setError(null)
  }

  // Check if token is expired
  useEffect(() => {
    if (userData && userData.expiresAt) {
      const now = Math.floor(Date.now() / 1000)
      if (now >= userData.expiresAt) {
        signOut()
      }
    }
  }, [userData])

  return {
    token,
    userData,
    loading,
    error,
    isAuthenticated: !!token && !!userData,
    signIn,
    signOut,
  }
}

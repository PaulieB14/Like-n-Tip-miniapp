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
      // For now, we'll simulate Quick Auth since the SDK method might not be available
      // In a real implementation, this would use the actual Quick Auth flow
      console.log('Simulating Quick Auth...')
      
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      setToken(mockToken)
      
      // Simulate user data
      const mockUserData: UserData = {
        fid: 12345,
        authenticated: true,
        domain: window.location.origin,
        issuedAt: Math.floor(Date.now() / 1000),
        expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      }
      
      setUserData(mockUserData)
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

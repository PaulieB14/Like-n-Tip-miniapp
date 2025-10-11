'use client'

import { useState, useEffect } from 'react'
import TipForm from '@/components/TipForm'
import TipHistory from '@/components/TipHistory'
import { Heart, Zap, Star, Gift, Users } from 'lucide-react'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Simulate mini app initialization
    const initializeApp = async () => {
      try {
        // In a real Base mini app, you'd initialize the SDK here
        // await sdk.actions.ready()
        setIsReady(true)
        
        // Get user context if available
        // const context = await sdk.getContext()
        // if (context) {
        //   setUser(context.user)
        // }
      } catch (error) {
        console.error('Failed to initialize mini app:', error)
        setIsReady(true) // Still show the app even if SDK fails
      }
    }

    initializeApp()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-50 to-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-base-500 mx-auto mb-4"></div>
          <p className="text-base-600 font-medium">Loading LIke n Tip...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-base-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-base-500 to-base-600 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LIke n Tip</h1>
                <p className="text-base-600 text-sm">Send tips with style!</p>
              </div>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back!</p>
                <p className="font-medium text-gray-900">{user.username || 'Base User'}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Spread Joy with <span className="text-base-500">Catchy Tips</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Perfect for group chats! Send tips to your favorite Base app users with fun messages and emojis.
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-base-500 mb-2" />
              <span className="text-sm text-gray-600">Instant</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-base-500 mb-2" />
              <span className="text-sm text-gray-600">Fun</span>
            </div>
            <div className="flex flex-col items-center">
              <Gift className="h-8 w-8 text-base-500 mb-2" />
              <span className="text-sm text-gray-600">Rewarding</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-base-500 mb-2" />
              <span className="text-sm text-gray-600">Social</span>
            </div>
          </div>
        </div>

        {/* Tip Form */}
        <div className="mb-12">
          <TipForm />
        </div>

        {/* Tip History */}
        <div>
          <TipHistory />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-base-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-sm">
            Built with ❤️ for the Base app community
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Powered by x402 protocol for seamless payments
          </p>
        </div>
      </footer>
    </div>
  )
}

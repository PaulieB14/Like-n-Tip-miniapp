'use client'

import { useState, useEffect } from 'react'
import BaseAppIntegration from '../components/BaseAppIntegration'
import { Heart, Zap, Star, Users, MessageSquare, Settings } from 'lucide-react'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'integration' | 'demo' | 'settings'>('integration')

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
                <p className="text-base-600 text-sm">Auto-tip when you like posts in Base app</p>
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
            Like a Post? <span className="text-base-500">Auto-Tip!</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Set your default tip amount and automatically send tips every time you like a post in Base app.
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-sm text-gray-600">Like</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-sm text-gray-600">Auto-Tip</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm text-gray-600">Reward</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm text-gray-600">Social</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('integration')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'integration'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Auto-Tip
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'demo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Demo
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'integration' && (
          <div className="max-w-2xl mx-auto">
            <BaseAppIntegration 
              currentUser={user}
              onLike={(postId, authorAddress) => {
                console.log('Base app like:', { postId, authorAddress })
              }}
              onTip={(authorAddress, amount, message) => {
                console.log('Base app tip:', { authorAddress, amount, message })
              }}
            />
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
              <p className="text-gray-600 mb-6">
                This mini app integrates directly with Base app's like system. Here's how it works:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-base-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Set Your Default Tip</h4>
                    <p className="text-sm text-gray-600">Choose how much you want to tip when you like posts (e.g., $0.10, $0.25, $1.00)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-base-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Like Posts in Base App</h4>
                    <p className="text-sm text-gray-600">Use Base app normally - like posts as you always do</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-base-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Tip Sent</h4>
                    <p className="text-sm text-gray-600">Your preset tip amount is automatically sent to the post author via x402 protocol</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Perfect for Base App!</h4>
                <p className="text-sm text-green-800">
                  This creates a seamless experience where liking posts automatically rewards creators. 
                  No extra steps, no complex UI - just like and tip!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integration Settings</h3>
              <p className="text-gray-600 mb-6">
                Configure how the auto-tip system works with Base app.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Base App Integration</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This mini app hooks into Base app's like system to automatically send tips.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Detects when you like posts in Base app</p>
                    <p>• Automatically sends your preset tip amount</p>
                    <p>• Uses x402 protocol for seamless payments</p>
                    <p>• Works with USDC on Base network</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Technical Details</h4>
                  <p className="text-sm text-blue-800">
                    The integration works by registering a handler with Base app's like system. 
                    When you like a post, it triggers the auto-tip functionality with your preset amount.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-base-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-sm">
            Built with ❤️ for the Base app community
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Seamless auto-tipping integrated with Base app's like system
          </p>
        </div>
      </footer>
    </div>
  )
}

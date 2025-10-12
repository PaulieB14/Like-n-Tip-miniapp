'use client'

import { useState, useEffect } from 'react'
import BaseAppIntegration from '../components/BaseAppIntegration'
import { Heart, Zap, Star, Users, MessageSquare, Settings, Sparkles, Gift, Crown } from 'lucide-react'

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
      <div className="min-h-screen bg-gradient-to-br from-base-50 via-white to-base-100 flex items-center justify-center">
        <div className="text-center slide-up">
          <div className="floating-animation mb-6">
            <div className="bg-gradient-to-r from-base-500 to-base-600 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center pulse-glow">
              <Heart className="h-10 w-10 text-white fill-current" />
            </div>
          </div>
          <p className="text-base-600 font-medium text-lg">Loading LIke n Tip...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-base-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-base-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-base-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-base-500/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-base-600/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto mobile-container py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 bounce-in">
              <div className="bg-gradient-to-r from-base-500 to-base-600 p-3 rounded-full shadow-lg pulse-glow">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gradient-text">LIke n Tip</h1>
                <p className="text-base-600 text-xs sm:text-sm">Revolutionary auto-tip for Base app</p>
              </div>
            </div>
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back!</p>
                <p className="font-medium text-gray-900">{user.username || 'Base User'}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto mobile-container py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 slide-up">
          <div className="floating-animation mb-6">
            <div className="bg-gradient-to-r from-base-500 to-base-600 p-4 sm:p-6 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center pulse-glow">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          
          <h2 className="mobile-text-large font-bold text-gray-900 mb-4">
            Like a Post? <span className="gradient-text">Auto-Tip!</span>
          </h2>
          <p className="mobile-text text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Set your default tip amount and automatically send tips every time you like a post in Base app. 
            Revolutionary like-to-tip experience! 🚀
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center flex-wrap gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex flex-col items-center bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full shadow-lg">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current" />
              </div>
              <span className="mobile-text-small text-gray-600 mt-2">Like</span>
            </div>
            <div className="flex flex-col items-center bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full shadow-lg">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="mobile-text-small text-gray-600 mt-2">Auto-Tip</span>
            </div>
            <div className="flex flex-col items-center bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full shadow-lg">
                <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="mobile-text-small text-gray-600 mt-2">Reward</span>
            </div>
            <div className="flex flex-col items-center bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="mobile-text-small text-gray-600 mt-2">Premium</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('integration')}
              className={`mobile-button rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'integration'
                  ? 'bg-gradient-to-r from-base-500 to-base-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Auto-Tip
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`mobile-button rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'demo'
                  ? 'bg-gradient-to-r from-base-500 to-base-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Demo
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`mobile-button rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-base-500 to-base-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="slide-up">
          {activeTab === 'integration' && (
            <div className="max-w-4xl mx-auto">
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
            <div className="max-w-4xl mx-auto">
              <div className="tip-card mb-6">
                <div className="text-center mb-6">
                  <div className="floating-animation mb-4">
                    <div className="bg-gradient-to-r from-base-500 to-base-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center pulse-glow">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
                  <p className="mobile-text text-gray-600">
                    Revolutionary auto-tipping that integrates seamlessly with Base app's like system.
                  </p>
                </div>
                
                <div className="mobile-grid gap-6">
                  <div className="flex items-start space-x-4 bounce-in" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-gradient-to-r from-base-500 to-base-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Set Your Default Tip</h4>
                      <p className="mobile-text-small text-gray-600">Choose how much you want to tip when you like posts (e.g., $0.10, $0.25, $1.00)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 bounce-in" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-gradient-to-r from-base-500 to-base-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Like Posts in Base App</h4>
                      <p className="mobile-text-small text-gray-600">Use Base app normally - like posts as you always do</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 bounce-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-gradient-to-r from-base-500 to-base-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Auto-Tip Sent</h4>
                      <p className="mobile-text-small text-gray-600">Your preset tip amount is automatically sent to the post author via x402 protocol</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900">Perfect for Base App!</h4>
                  </div>
                  <p className="mobile-text-small text-green-800">
                    This creates a seamless experience where liking posts automatically rewards creators. 
                    No extra steps, no complex UI - just like and tip! 🚀
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="tip-card">
                <div className="text-center mb-6">
                  <div className="floating-animation mb-4">
                    <div className="bg-gradient-to-r from-base-500 to-base-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center pulse-glow">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Integration Settings</h3>
                  <p className="mobile-text text-gray-600">
                    Configure how the auto-tip system works with Base app.
                  </p>
                </div>
                
                <div className="mobile-grid gap-6">
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Base App Integration</h4>
                    <p className="mobile-text-small text-gray-600 mb-4">
                      This mini app hooks into Base app's like system to automatically send tips.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-base-500 rounded-full"></div>
                        <span className="mobile-text-small text-gray-600">Detects when you like posts in Base app</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-base-500 rounded-full"></div>
                        <span className="mobile-text-small text-gray-600">Automatically sends your preset tip amount</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-base-500 rounded-full"></div>
                        <span className="mobile-text-small text-gray-600">Uses x402 protocol for seamless payments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-base-500 rounded-full"></div>
                        <span className="mobile-text-small text-gray-600">Works with USDC on Base network</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Technical Details</h4>
                    <p className="mobile-text-small text-blue-800">
                      The integration works by registering a handler with Base app's like system. 
                      When you like a post, it triggers the auto-tip functionality with your preset amount.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-6xl mx-auto mobile-container py-6 sm:py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-base-500 to-base-600 p-2 rounded-full">
              <Heart className="h-4 w-4 text-white fill-current" />
            </div>
            <span className="font-semibold text-gray-900">LIke n Tip</span>
          </div>
          <p className="mobile-text-small text-gray-600 mb-2">
            Built with ❤️ for the Base app community
          </p>
          <p className="mobile-text-small text-gray-500">
            Revolutionary auto-tipping integrated with Base app's like system
          </p>
        </div>
      </footer>
    </div>
  )
}

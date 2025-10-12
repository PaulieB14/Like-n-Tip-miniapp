'use client'

import { useState, useEffect } from 'react'
import TipForm from '../components/TipForm'
import TipHistory from '../components/TipHistory'
import LikeToTip from '../components/LikeToTip'
import { Heart, Zap, Star, Gift, Users, MessageSquare } from 'lucide-react'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'demo' | 'form' | 'history'>('demo')

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
                <p className="text-base-600 text-sm">Like a post? Send a tip!</p>
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
            Like a Post? <span className="text-base-500">Send a Tip!</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The revolutionary like-to-tip experience for Base app. Click like, then tip instantly!
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-sm text-gray-600">Like</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-sm text-gray-600">Tip</span>
            </div>
            <div className="flex flex-col items-center">
              <Gift className="h-8 w-8 text-green-500 mb-2" />
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
              onClick={() => setActiveTab('form')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'form'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              Send Tip
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className="h-4 w-4 inline mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'demo' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Try the Like-to-Tip Experience!</h3>
              <p className="text-gray-600 mb-6">
                This simulates how the feature would work in Base app posts. Click the like button below to see the magic happen!
              </p>
              
              {/* Sample Post */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-base-500 to-base-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">@alice</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">
                  "Just built an amazing Base mini app! The x402 protocol makes payments so seamless. Can't wait to see what the community builds! 🚀"
                </p>
                
                {/* Like to Tip Button */}
                <div className="flex items-center justify-between">
                  <LikeToTip 
                    postId="demo-post-123"
                    authorUsername="@alice"
                    authorAddress="0x1234567890123456789012345678901234567890"
                    postContent="Just built an amazing Base mini app! The x402 protocol makes payments so seamless. Can't wait to see what the community builds! 🚀"
                  />
                  <div className="text-sm text-gray-500">
                    💬 12 comments
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Click the "Like" button on any post</li>
                  <li>2. A tip modal automatically appears</li>
                  <li>3. Choose your tip amount and send instantly</li>
                  <li>4. The author gets your tip with a nice message!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="mb-12">
            <TipForm />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <TipHistory />
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
            Revolutionary like-to-tip experience powered by x402 protocol
          </p>
        </div>
      </footer>
    </div>
  )
}

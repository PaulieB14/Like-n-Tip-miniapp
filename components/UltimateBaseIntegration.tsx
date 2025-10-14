'use client'

import { useState, useEffect } from 'react'
import { Heart, Settings, User, History, ExternalLink } from 'lucide-react'
import SimpleTipApp from './SimpleTipApp'

// Import the Farcaster SDK with error handling
let sdk: any = null
try {
  const farcasterSdk = require('@farcaster/miniapp-sdk')
  sdk = farcasterSdk.sdk
} catch (error) {
  console.log('Farcaster SDK not available in this environment:', error)
}

export default function UltimateBaseIntegration() {
  const [activeTab, setActiveTab] = useState('home')
  const [isReady, setIsReady] = useState(false)
  const [recentTips, setRecentTips] = useState<Array<{
    postId: string
    amount: number
    timestamp: Date
    txHash?: string
    recipient?: string
    postUrl?: string
    postContent?: string
    platform?: string
  }>>([])

  // Dismiss splash screen when interface is ready
  useEffect(() => {
    const dismissSplash = async () => {
      try {
        if (sdk && sdk.actions && sdk.actions.ready) {
          console.log('Calling sdk.actions.ready()...')
          await sdk.actions.ready()
          console.log('Splash screen dismissed - interface ready')
        } else {
          console.log('Farcaster SDK not available, skipping ready call')
        }
        setIsReady(true)
      } catch (error) {
        console.log('Error calling ready:', error)
        // Set ready even if error occurs (for web preview)
        setIsReady(true)
      }
    }
    
    // Call ready after a short delay to ensure interface is loaded
    const timer = setTimeout(dismissSplash, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const renderHomeTab = () => (
    <SimpleTipApp
      onTipSent={(tipData) => {
        setRecentTips(prev => [{
          postId: tipData.postId || 'unknown',
          amount: tipData.amount,
          timestamp: new Date(),
          txHash: tipData.txHash,
          recipient: tipData.recipient,
          postUrl: tipData.postUrl,
          postContent: tipData.postContent,
          platform: tipData.platform
        }, ...prev.slice(0, 9)]) // Keep only last 10 tips
      }}
    />
  )

  const renderHistoryTab = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <History className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tip History</h1>
        <p className="text-slate-600">Your tipping history will appear here</p>
      </div>

      {recentTips.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Tips Yet</h3>
          <p className="text-slate-600">Start tipping creators to see your history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentTips.map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="space-y-4">
                {/* Tip Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Tip to @{tip.recipient}</h3>
                      <p className="text-sm text-slate-600">
                        {tip.platform && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {tip.platform}
                          </span>
                        )}
                        {tip.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${tip.amount.toFixed(3)}</p>
                    {tip.txHash && (
                      <a
                        href={`https://basescan.org/tx/${tip.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View TX
                      </a>
                    )}
                  </div>
                </div>

                {/* Post Preview */}
                {tip.postContent && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium text-slate-900">@{tip.recipient}</p>
                          {tip.postUrl && (
                            <a
                              href={tip.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                          {tip.postContent}
                        </p>
                        {tip.postUrl && (
                          <a
                            href={tip.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            View original post →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderProfileTab = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile</h1>
        <p className="text-slate-600">Your tipping preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Default Tip Amount</h4>
              <p className="text-sm text-slate-600">Your preferred tip amount</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">$0.10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Show loading state while dismissing splash screen
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Loading Tip App...</h2>
          <p className="text-slate-600">Preparing your x402 micropayment experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Simple Tip App</h1>
            <p className="text-sm text-slate-600">Send real USDC tips to creators</p>
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-700">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>

      {/* Mobile-Optimized Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-blue-500 bg-blue-50' : 'text-slate-500'
            }`}
          >
            <Heart className="h-4 w-4 mb-1" />
            <span className="text-xs font-medium">Tip</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
              activeTab === 'history' ? 'text-blue-500 bg-blue-50' : 'text-slate-500'
            }`}
          >
            <History className="h-4 w-4 mb-1" />
            <span className="text-xs font-medium">History</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-blue-500 bg-blue-50' : 'text-slate-500'
            }`}
          >
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
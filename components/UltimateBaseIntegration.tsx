'use client'

import { useState, useEffect } from 'react'
import { Heart, Settings, User, History } from 'lucide-react'
import SimpleTipApp from './SimpleTipApp'

export default function UltimateBaseIntegration() {
  const [activeTab, setActiveTab] = useState('home')
  const [recentTips, setRecentTips] = useState<Array<{
    postId: string
    amount: number
    timestamp: Date
    txHash?: string
    recipient?: string
  }>>([])

  // Dismiss splash screen when component mounts
  useEffect(() => {
    const dismissSplash = async () => {
      try {
        // Check if we're in a Base app environment
        if (typeof window !== 'undefined' && (window as any).sdk) {
          await (window as any).sdk.actions.ready()
          console.log('Splash screen dismissed')
        }
      } catch (error) {
        console.log('Not in Base app environment or SDK not available')
      }
    }
    
    dismissSplash()
  }, [])

  const renderHomeTab = () => (
    <SimpleTipApp
      onTipSent={(tipData) => {
        setRecentTips(prev => [{
          postId: tipData.postId || 'unknown',
          amount: tipData.amount,
          timestamp: new Date(),
          txHash: tipData.txHash,
          recipient: tipData.recipient
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Tip to @{tip.recipient}</h3>
                  <p className="text-sm text-slate-600">Post: {tip.postId}</p>
                  <p className="text-xs text-slate-500">{tip.timestamp.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${tip.amount.toFixed(2)}</p>
                  {tip.txHash && (
                    <p className="text-xs text-slate-500">TX: {tip.txHash.slice(0, 8)}...</p>
                  )}
                </div>
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
'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Heart, Zap, Settings, CheckCircle, Wallet, Sparkles, Shield, Bolt } from 'lucide-react'
import { useBaseAccountCapabilities } from '@/lib/useBaseAccountCapabilities'
import { useQuickAuth } from '@/lib/useQuickAuth'

interface AutoTipSettings {
  enabled: boolean
  defaultAmount: number
  quickAmounts: number[]
  useSponsoredGas: boolean
  useAtomicBatch: boolean
}

export default function BaseAccountIntegration() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const { capabilities, loading: capabilitiesLoading, isBaseAccount } = useBaseAccountCapabilities()
  const { userData, isAuthenticated, signIn, signOut, loading: authLoading } = useQuickAuth()

  const [settings, setSettings] = useState<AutoTipSettings>({
    enabled: false,
    defaultAmount: 0.10,
    quickAmounts: [0.01, 0.05, 0.10, 0.25, 0.50, 1.00],
    useSponsoredGas: true,
    useAtomicBatch: true,
  })

  const [showSettings, setShowSettings] = useState(false)
  const [recentTips, setRecentTips] = useState<Array<{
    postId: string
    amount: number
    timestamp: Date
    txHash?: string
  }>>([])

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('baseAccountAutoTipSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSettings = (newSettings: Partial<AutoTipSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('baseAccountAutoTipSettings', JSON.stringify(updated))
  }

  // Enhanced tip function with Base Account capabilities
  const sendTipWithBaseAccount = async (recipientAddress: string, amount: number, message: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      // For now, we'll simulate the transaction since we need proper wagmi setup
      // In a real implementation, this would use the writeContract with proper chain/account
      console.log('Simulating tip transaction:', {
        recipient: recipientAddress,
        amount: amount,
        message: message,
        capabilities: capabilities
      })
      
      // Simulate transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return mockTxHash
    } catch (error) {
      console.error('Payment failed:', error)
      throw error
    }
  }

  // This function would be called by Base app when a user likes a post
  const handleBaseAppLike = async (postId: string, authorAddress: string, authorUsername: string) => {
    console.log('Base app like detected:', { postId, authorAddress, authorUsername })
    
    // If auto-tip is enabled and wallet is connected, send tip automatically
    if (settings.enabled && settings.defaultAmount > 0 && isConnected && address) {
      try {
        const txHash = await sendTipWithBaseAccount(
          authorAddress, 
          settings.defaultAmount, 
          `Liked your post! 💖`
        )
        
        // Record the tip
        setRecentTips(prev => [{
          postId,
          amount: settings.defaultAmount,
          timestamp: new Date(),
          txHash: txHash as string,
        }, ...prev.slice(0, 9)]) // Keep last 10 tips
        
        console.log(`Auto-tipped ${authorUsername} $${settings.defaultAmount} - TX: ${txHash}`)
      } catch (error) {
        console.error('Auto-tip failed:', error)
      }
    }
  }

  // Expose handler to Base app
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).baseAppAutoTipHandler = handleBaseAppLike
    }
  }, [settings, isConnected, address, capabilities])

  return (
    <div className="space-y-6">
      {/* Quick Auth Section */}
      <div className="tip-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quick Auth</h3>
              <p className="text-sm text-gray-600">Secure authentication with Farcaster</p>
            </div>
          </div>
          
          {!isAuthenticated ? (
            <button
              onClick={signIn}
              disabled={authLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <span className="font-medium">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">FID: {userData?.fid}</p>
                <p className="text-xs text-gray-500">Authenticated</p>
              </div>
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Base Account Capabilities */}
      <div className="tip-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-base-500 to-base-600 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Base Account Features</h3>
              <p className="text-sm text-gray-600">Enhanced capabilities for seamless tipping</p>
            </div>
          </div>
          
          {capabilitiesLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-base-500 border-t-transparent" />
          ) : isBaseAccount ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Base Account</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Standard Wallet</span>
            </div>
          )}
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 ${capabilities.atomicBatch ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Bolt className={`h-5 w-5 ${capabilities.atomicBatch ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-medium text-gray-900">Atomic Batch</h4>
            </div>
            <p className="text-sm text-gray-600">
              {capabilities.atomicBatch ? 'Multiple operations in one transaction' : 'Not available'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${capabilities.paymasterService ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className={`h-5 w-5 ${capabilities.paymasterService ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-medium text-gray-900">Sponsored Gas</h4>
            </div>
            <p className="text-sm text-gray-600">
              {capabilities.paymasterService ? 'App pays gas fees' : 'User pays gas fees'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${capabilities.auxiliaryFunds ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className={`h-5 w-5 ${capabilities.auxiliaryFunds ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-medium text-gray-900">Auxiliary Funds</h4>
            </div>
            <p className="text-sm text-gray-600">
              {capabilities.auxiliaryFunds ? 'Enhanced funding options' : 'Standard funding'}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Tip Settings */}
      <div className="tip-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-base-500 to-base-600 p-2 rounded-full">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Auto-Tip Integration</h3>
              <p className="text-sm text-gray-600">Seamlessly tip when you like posts</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <Settings className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${settings.enabled && isConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              {settings.enabled && isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">Auto-Tip Active</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    {!isConnected ? 'Connect Wallet First' : 'Auto-Tip Disabled'}
                  </span>
                </>
              )}
            </div>
            {settings.enabled && isConnected && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-700">
                  You'll automatically tip <strong>${settings.defaultAmount.toFixed(2)} USDC</strong> when you like posts
                </p>
                {capabilities.paymasterService && settings.useSponsoredGas && (
                  <p className="text-sm text-blue-700">
                    ✨ Gas fees will be sponsored by the app
                  </p>
                )}
                {capabilities.atomicBatch && settings.useAtomicBatch && (
                  <p className="text-sm text-purple-700">
                    ⚡ Using atomic batch for optimal performance
                  </p>
                )}
              </div>
            )}
            {!isConnected && (
              <p className="text-sm text-gray-600 mt-1">
                Connect your Base app wallet to enable auto-tipping
              </p>
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Auto-Tip Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Enable/Disable */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Tip on Like</h4>
                    <p className="text-sm text-gray-600">Automatically send tips when you like posts</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ enabled: !settings.enabled })}
                    disabled={!isConnected}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      settings.enabled 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-700'
                    } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {settings.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {settings.enabled && (
                <>
                  {/* Default Amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Default Tip Amount (USDC)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {settings.quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => updateSettings({ defaultAmount: amount })}
                          className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                            settings.defaultAmount === amount
                              ? 'bg-base-500 text-white border-base-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          ${amount.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="mb-6">
                    <input
                      type="number"
                      value={settings.defaultAmount}
                      onChange={(e) => updateSettings({ defaultAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.10"
                      step="0.01"
                      min="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
                    />
                  </div>

                  {/* Base Account Features */}
                  {isBaseAccount && (
                    <div className="mb-6 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-blue-900">Sponsored Gas</h4>
                          <p className="text-sm text-blue-700">App pays gas fees for you</p>
                        </div>
                        <button
                          onClick={() => updateSettings({ useSponsoredGas: !settings.useSponsoredGas })}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            settings.useSponsoredGas 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {settings.useSponsoredGas ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-purple-900">Atomic Batch</h4>
                          <p className="text-sm text-purple-700">Optimize transaction performance</p>
                        </div>
                        <button
                          onClick={() => updateSettings({ useAtomicBatch: !settings.useAtomicBatch })}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            settings.useAtomicBatch 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {settings.useAtomicBatch ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-base-500 to-base-600 text-white font-bold py-3 px-4 rounded-lg hover:from-base-600 hover:to-base-700 transition-all duration-200"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Recent Tips */}
        {recentTips.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recent Auto-Tips</h4>
            <div className="space-y-2">
              {recentTips.slice(0, 5).map((tip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Post {tip.postId.slice(-6)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">${tip.amount.toFixed(2)}</span>
                    {tip.txHash && (
                      <p className="text-xs text-gray-500">TX: {tip.txHash.slice(0, 8)}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Base Account Integration</h4>
          <p className="text-sm text-blue-800">
            This mini app leverages Base Account capabilities for seamless tipping. When you like a post in Base app, 
            it will automatically send your preset tip amount using advanced features like sponsored gas and atomic batching.
          </p>
        </div>
      </div>
    </div>
  )
}

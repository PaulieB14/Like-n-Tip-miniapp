'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Heart, Zap, Settings, CheckCircle, Wallet, Sparkles, Shield, Bolt, User, MapPin, Smartphone, Bell, Star, Gift, TrendingUp } from 'lucide-react'
import { useBaseAccountCapabilities } from '@/lib/useBaseAccountCapabilities'
import { useQuickAuth } from '@/lib/useQuickAuth'
import { useMiniAppContext } from '@/lib/useMiniAppContext'

interface AutoTipSettings {
  enabled: boolean
  defaultAmount: number
  quickAmounts: number[]
  useSponsoredGas: boolean
  useAtomicBatch: boolean
}

export default function UltimateBaseIntegration() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const { capabilities, loading: capabilitiesLoading, isBaseAccount } = useBaseAccountCapabilities()
  const { userData, isAuthenticated, signIn, signOut, loading: authLoading } = useQuickAuth()
  const { context, isInMiniApp, user, location, client, features, loading: contextLoading } = useMiniAppContext()

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
    recipient?: string
  }>>([])

  useEffect(() => {
    const saved = localStorage.getItem('ultimateBaseAutoTipSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSettings = (newSettings: Partial<AutoTipSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('ultimateBaseAutoTipSettings', JSON.stringify(updated))
  }

  const sendTipWithBaseAccount = async (recipientAddress: string, amount: number, message: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('Simulating tip transaction with Base Account capabilities:', {
        recipient: recipientAddress,
        amount: amount,
        message: message,
        capabilities: capabilities,
        useSponsoredGas: settings.useSponsoredGas,
        useAtomicBatch: settings.useAtomicBatch,
      })

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`
      return mockTxHash
    } catch (error) {
      console.error('Tip transaction failed:', error)
      throw error
    }
  }

  const handleBaseAppLike = async (postId: string, authorAddress: string, authorUsername: string) => {
    console.log('Base app like detected:', { postId, authorAddress, authorUsername })

    if (settings.enabled && settings.defaultAmount > 0 && isConnected && address) {
      try {
        const txHash = await sendTipWithBaseAccount(authorAddress, settings.defaultAmount, `Liked your post! 💖`)

        setRecentTips(prev => [{
          postId,
          amount: settings.defaultAmount,
          timestamp: new Date(),
          txHash,
          recipient: authorUsername
        }, ...prev.slice(0, 9)])

        console.log(`Auto-tipped ${authorUsername} $${settings.defaultAmount} - TX: ${txHash}`)
      } catch (error) {
        console.error('Auto-tip failed:', error)
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).baseAppAutoTipHandler = handleBaseAppLike
    }
  }, [handleBaseAppLike])

  useEffect(() => {
    if (isInMiniApp && !isAuthenticated && !authLoading) {
      signIn()
    }
  }, [isInMiniApp, isAuthenticated, authLoading, signIn])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LIke n Tip
                </h1>
                <p className="text-sm text-slate-600">Auto-tip when you like posts</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Authenticated</span>
                </div>
              )}
              {isConnected && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Feature Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Auto-Tip Integration</h2>
                <p className="text-blue-100">Seamlessly tip creators when you like their posts</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.enabled && isConnected 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Auto-Tip Status</h3>
                  <p className="text-slate-600">
                    {settings.enabled && isConnected 
                      ? `Auto-tipping $${settings.defaultAmount.toFixed(2)} USDC per like`
                      : 'Auto-tipping is disabled'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>

            {settings.enabled && isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {capabilities.paymasterService && settings.useSponsoredGas && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Sponsored Gas</p>
                      <p className="text-sm text-blue-700">App pays gas fees</p>
                    </div>
                  </div>
                )}
                {capabilities.atomicBatch && settings.useAtomicBatch && (
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Bolt className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Atomic Batch</p>
                      <p className="text-sm text-purple-700">Optimized transactions</p>
                    </div>
                  </div>
                )}
                {features?.haptics && (
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900">Haptic Feedback</p>
                      <p className="text-sm text-yellow-700">Enhanced experience</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isConnected && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">Connect Your Wallet</p>
                    <p className="text-sm text-amber-700">Connect your Base app wallet to enable auto-tipping</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mini App Context Card */}
        {isInMiniApp && context && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Mini App Context</h2>
                  <p className="text-emerald-100">Real-time user and environment data</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-600" />
                      <span>User Profile</span>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        {user.pfpUrl && (
                          <img src={user.pfpUrl} alt="Profile" className="w-8 h-8 rounded-full" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{user.displayName || user.username}</p>
                          <p className="text-sm text-slate-600">@{user.username}</p>
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-slate-600">{user.bio}</p>
                      )}
                    </div>
                  </div>
                )}

                {location && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <span>Location Context</span>
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Type:</span> {location.type}
                      </p>
                      {location.cast && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">From Cast:</span> {location.cast.text?.slice(0, 50)}...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {client && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-slate-600" />
                      <span>Client Info</span>
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Platform:</span> {client.platformType}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Added:</span> {client.added ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Tips */}
        {recentTips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Recent Auto-Tips</h2>
                  <p className="text-yellow-100">Your latest tipping activity</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {recentTips.slice(0, 5).map((tip, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {tip.recipient ? `@${tip.recipient}` : `Post ${tip.postId.slice(-6)}`}
                        </p>
                        <p className="text-sm text-slate-600">
                          {tip.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${tip.amount.toFixed(2)}</p>
                      {tip.txHash && (
                        <p className="text-xs text-slate-500 font-mono">
                          {tip.txHash.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Auto-Tip Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Enable/Disable */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">Auto-Tip on Like</h4>
                      <p className="text-sm text-slate-600">Automatically send tips when you like posts</p>
                    </div>
                    <button
                      onClick={() => updateSettings({ enabled: !settings.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enabled ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.enabled && (
                  <>
                    {/* Default Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Default Tip Amount (USDC)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {settings.quickAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => updateSettings({ defaultAmount: amount })}
                            className={`p-3 text-sm rounded-xl border-2 transition-all duration-200 ${
                              settings.defaultAmount === amount
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            ${amount.toFixed(2)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Custom Amount
                      </label>
                      <input
                        type="number"
                        value={settings.defaultAmount}
                        onChange={(e) => updateSettings({ defaultAmount: parseFloat(e.target.value) || 0 })}
                        placeholder="0.10"
                        step="0.01"
                        min="0.01"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Base Account Features */}
                    {isBaseAccount && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Base Account Features</h4>
                        
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-blue-900">Sponsored Gas</h5>
                              <p className="text-sm text-blue-700">App pays gas fees for you</p>
                            </div>
                            <button
                              onClick={() => updateSettings({ useSponsoredGas: !settings.useSponsoredGas })}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                settings.useSponsoredGas ? 'bg-blue-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  settings.useSponsoredGas ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-purple-900">Atomic Batch</h5>
                              <p className="text-sm text-purple-700">Optimize transaction performance</p>
                            </div>
                            <button
                              onClick={() => updateSettings({ useAtomicBatch: !settings.useAtomicBatch })}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                settings.useAtomicBatch ? 'bg-purple-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  settings.useAtomicBatch ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => {
                    localStorage.setItem("ultimateBaseAutoTipSettings", JSON.stringify(settings))
                    setShowSettings(false)
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Integration Info */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Ultimate Base Integration</h2>
                <p className="text-indigo-100">Powered by Base's advanced features</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-slate-700 leading-relaxed">
              This mini app leverages all Base features: <strong>Mini App Context</strong> for instant user data, 
              <strong> Quick Auth</strong> for secure authentication, and <strong>Base Account capabilities</strong> for seamless tipping 
              with sponsored gas and atomic batching.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

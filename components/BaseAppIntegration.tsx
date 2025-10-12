'use client'

import { useState, useEffect } from 'react'
import { Heart, Zap, Settings, CheckCircle, Wallet } from 'lucide-react'
import BaseAppWallet from './BaseAppWallet'

interface BaseAppIntegrationProps {
  // These would come from Base app's context
  currentUser?: {
    address: string
    username: string
  }
  // Base app would provide these hooks
  onLike?: (postId: string, authorAddress: string) => void
  onTip?: (authorAddress: string, amount: number, message: string) => void
}

interface AutoTipSettings {
  enabled: boolean
  defaultAmount: number
  quickAmounts: number[]
}

export default function BaseAppIntegration({ 
  currentUser,
  onLike,
  onTip 
}: BaseAppIntegrationProps) {
  const [settings, setSettings] = useState<AutoTipSettings>({
    enabled: false,
    defaultAmount: 0.10,
    quickAmounts: [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]
  })

  const [showSettings, setShowSettings] = useState(false)
  const [recentTips, setRecentTips] = useState<Array<{
    postId: string
    amount: number
    timestamp: Date
  }>>([])
  
  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>('')
  const [walletProvider, setWalletProvider] = useState<any>(null)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('baseAppAutoTipSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSettings = (newSettings: Partial<AutoTipSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('baseAppAutoTipSettings', JSON.stringify(updated))
  }

  const handleWalletConnected = (address: string, provider: any) => {
    setUserAddress(address)
    setWalletProvider(provider)
    setIsWalletConnected(true)
  }

  const handleWalletDisconnected = () => {
    setUserAddress('')
    setWalletProvider(null)
    setIsWalletConnected(false)
  }

  // This function would be called by Base app when a user likes a post
  const handleBaseAppLike = async (postId: string, authorAddress: string, authorUsername: string) => {
    console.log('Base app like detected:', { postId, authorAddress, authorUsername })
    
    // If auto-tip is enabled and wallet is connected, send tip automatically
    if (settings.enabled && settings.defaultAmount > 0 && isWalletConnected && walletProvider) {
      try {
        // Use Base app's payment API
        const txHash = await sendTipViaBaseApp(authorAddress, settings.defaultAmount, `Liked your post! 💖`)
        
        // Record the tip
        setRecentTips(prev => [{
          postId,
          amount: settings.defaultAmount,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]) // Keep last 10 tips
        
        console.log(`Auto-tipped ${authorUsername} $${settings.defaultAmount} - TX: ${txHash}`)
      } catch (error) {
        console.error('Auto-tip failed:', error)
      }
    }
  }

  const sendTipViaBaseApp = async (recipientAddress: string, amount: number, message: string) => {
    if (!walletProvider) {
      throw new Error('Wallet not connected')
    }

    try {
      // Use Base app's payment API
      // const txHash = await walletProvider.sendPayment({
      //   to: recipientAddress,
      //   amount: amount,
      //   currency: 'USDC',
      //   message: message
      // })
      
      // For demo purposes, simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
      
      return mockTxHash
      
    } catch (error) {
      console.error('Payment failed:', error)
      throw error
    }
  }

  // This would be exposed to Base app
  useEffect(() => {
    // In a real integration, this would register the handler with Base app
    if (typeof window !== 'undefined') {
      (window as any).baseAppAutoTipHandler = handleBaseAppLike
    }
  }, [settings, isWalletConnected, walletProvider])

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <BaseAppWallet
        onWalletConnected={handleWalletConnected}
        onWalletDisconnected={handleWalletDisconnected}
        isConnected={isWalletConnected}
        userAddress={userAddress}
      />

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
          <div className={`p-4 rounded-lg ${settings.enabled && isWalletConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              {settings.enabled && isWalletConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">Auto-Tip Active</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    {!isWalletConnected ? 'Connect Wallet First' : 'Auto-Tip Disabled'}
                  </span>
                </>
              )}
            </div>
            {settings.enabled && isWalletConnected && (
              <p className="text-sm text-green-700 mt-1">
                You'll automatically tip <strong>${settings.defaultAmount.toFixed(2)} USDC</strong> when you like posts
              </p>
            )}
            {!isWalletConnected && (
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
                    disabled={!isWalletConnected}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      settings.enabled 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-700'
                    } ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  <span className="font-medium text-gray-900">${tip.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Base App Integration</h4>
          <p className="text-sm text-blue-800">
            This mini app integrates with Base app's like system and wallet. When you like a post in Base app, 
            it will automatically send your preset tip amount to the author using your Base app wallet.
          </p>
        </div>
      </div>
    </div>
  )
}

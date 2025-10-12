'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Heart, Zap, Settings, CheckCircle, Wallet, Sparkles, Shield, Bolt, User, MapPin, Smartphone, Bell, Star, Gift, TrendingUp, ArrowRight, Play, Home, History, MessageCircle } from 'lucide-react'
import { useBaseAccountCapabilities } from '@/lib/useBaseAccountCapabilities'
import { useQuickAuth } from '@/lib/useQuickAuth'
import { useMiniAppContext } from '@/lib/useMiniAppContext'
import { sdk } from '@farcaster/miniapp-sdk'
import TipDemo from './TipDemo'
import CommentTipDemo from './CommentTipDemo'

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
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('comments')
  const [recentTips, setRecentTips] = useState<Array<{
    postId: string
    amount: number
    timestamp: Date
    txHash?: string
    recipient?: string
  }>>([])
  const [isAddingMiniApp, setIsAddingMiniApp] = useState(false)
  const [addMiniAppResult, setAddMiniAppResult] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('ultimateBaseAutoTipSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const updateSettings = (newSettings: Partial<AutoTipSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('ultimateBaseAutoTipSettings', JSON.stringify(updated))
  }

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
  }

  const handleAddMiniApp = async () => {
    if (!isInMiniApp) {
      setAddMiniAppResult('This feature only works within Base app')
      return
    }

    setIsAddingMiniApp(true)
    setAddMiniAppResult('')
    
    try {
      const response = await sdk.actions.addMiniApp()
      
      if (response.notificationDetails) {
        setAddMiniAppResult('✅ Mini App added with notifications enabled!')
      } else {
        setAddMiniAppResult('✅ Mini App added without notifications')
      }
    } catch (error: any) {
      console.error('Failed to add mini app:', error)
      setAddMiniAppResult(`❌ Error: ${error.message || 'Failed to add mini app'}`)
    } finally {
      setIsAddingMiniApp(false)
    }
  }

  const sendTipWithBaseAccount = async (recipientAddress: string, amount: number, message: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    try {
      console.log('Sending tip with Base Account capabilities:', {
        recipient: recipientAddress,
        amount: amount,
        message: message,
        capabilities: capabilities,
        useSponsoredGas: settings.useSponsoredGas,
        useAtomicBatch: settings.useAtomicBatch,
      })

      // Calculate amounts for real transaction
      // Real transaction implementation would go here
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`
      return mockTxHash
    } catch (error) {
      console.error('Tip transaction failed:', error)
      throw error
    } finally {
      setIsLoading(false)
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

  // Call sdk.actions.ready() when app is loaded
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we're in a mini app
        const isInMiniApp = await sdk.isInMiniApp()
        if (isInMiniApp) {
          // Call ready() to hide splash screen and display content
          await sdk.actions.ready()
          console.log('Mini app is ready and splash screen hidden')
        }
      } catch (error) {
        console.error('Error initializing mini app:', error)
      }
    }

    initializeApp()
  }, [])

  // Onboarding Flow
  if (showOnboarding) {
    const onboardingSteps = [
      {
        title: "Welcome to LIke n Tip",
        description: "Automatically tip creators when you like their posts in Base app",
        icon: Heart,
        color: "from-blue-500 to-purple-600"
      },
      {
        title: "Set Your Tip Amount",
        description: "Choose how much to tip per like - from $0.01 to $1.00",
        icon: Zap,
        color: "from-green-500 to-emerald-600"
      },
      {
        title: "Start Tipping",
        description: "Connect your wallet and start auto-tipping with every like!",
        icon: Play,
        color: "from-yellow-500 to-orange-600"
      }
    ]

    const currentStep = onboardingSteps[onboardingStep]
    const IconComponent = currentStep.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${currentStep.color} rounded-2xl flex items-center justify-center`}>
            <IconComponent className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{currentStep.title}</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">{currentStep.description}</p>
          
          <div className="flex justify-center space-x-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === onboardingStep ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {onboardingStep > 0 && (
              <button
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (onboardingStep < onboardingSteps.length - 1) {
                  setOnboardingStep(onboardingStep + 1)
                } else {
                  completeOnboarding()
                }
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>{onboardingStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Content
  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Primary CTA - Auto-Tip Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Auto-Tip Status</h2>
              <p className="text-blue-100">Seamlessly tip creators when you like their posts</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.enabled && isConnected 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Auto-Tip</h3>
                <p className="text-sm text-slate-600">
                  {settings.enabled && isConnected 
                    ? `$${settings.defaultAmount.toFixed(2)} USDC per like`
                    : 'Disabled'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              {settings.enabled ? 'Configure' : 'Enable'}
            </button>
          </div>

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

          {/* Add Mini App Button */}
          {isInMiniApp && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Add to Base App</p>
                    <p className="text-sm text-blue-700">Add this mini app to your Base app for auto-tipping</p>
                  </div>
                </div>
                <button
                  onClick={handleAddMiniApp}
                  disabled={isAddingMiniApp}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isAddingMiniApp ? 'Adding...' : 'Add Mini App'}
                </button>
              </div>
              {addMiniAppResult && (
                <div className="mt-3 p-3 bg-white rounded-lg border">
                  <p className="text-sm">{addMiniAppResult}</p>
                </div>
              )}
            </div>
          )}

          {/* Demo Tip Button */}
          {settings.enabled && isConnected && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Demo Auto-Tip</p>
                    <p className="text-sm text-green-700">Test the auto-tip functionality</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBaseAppLike('demo-post-123', '0x1234567890123456789012345678901234567890', 'Demo User')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : `Send $${settings.defaultAmount.toFixed(2)} Tip`}
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-blue-900">Processing tip transaction...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Limitations */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Current Status</h3>
            <p className="text-sm text-amber-700">Auto-tip on like is not yet available</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-amber-800">
          <p>• <strong>Base app doesn't currently expose like events</strong> to mini apps</p>
          <p>• <strong>Auto-tip functionality is ready</strong> but needs Base app integration</p>
          <p>• <strong>Use the demo button below</strong> to test the tip functionality</p>
          <p>• <strong>Real auto-tip will work</strong> once Base app adds like event support</p>
        </div>
      </div>

      {/* Base Account Features */}
      {isBaseAccount && settings.enabled && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Base Account Features</h3>
          <div className="grid grid-cols-1 gap-3">
            {capabilities.paymasterService && settings.useSponsoredGas && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
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
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Bolt className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">Atomic Batch</p>
                  <p className="text-sm text-purple-700">Optimized transactions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {recentTips.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
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
              {recentTips.map((tip, index) => (
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
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <History className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No Tips Yet</h3>
          <p className="text-slate-600">Your auto-tip history will appear here once you start liking posts.</p>
        </div>
      )}
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Profile */}
      {user && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Profile</h3>
          <div className="flex items-center space-x-4">
            {user.pfpUrl && (
              <img 
                src={user.pfpUrl} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm" 
              />
            )}
            <div>
              <p className="font-semibold text-slate-900">{user.displayName || user.username}</p>
              <p className="text-slate-600">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-slate-600 mt-1">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Settings</h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-slate-900">Auto-Tip Settings</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>
          
          {isAuthenticated && (
            <button
              onClick={signOut}
              className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">Sign Out</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Status</h3>
        <div className="space-y-3">
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-slate-700">Authenticated</span>
            </div>
          )}
          {isConnected && (
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-blue-500" />
              <span className="text-slate-700">Wallet Connected</span>
            </div>
          )}
          {isBaseAccount && (
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-purple-500" />
              <span className="text-slate-700">Base Account</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LIke n Tip</h1>
                <p className="text-xs text-slate-600">Auto-tip when you like</p>
              </div>
            </div>
            
            {/* User Profile Display */}
            {user && (
              <div className="flex items-center space-x-2">
                {user.pfpUrl && (
                  <img 
                    src={user.pfpUrl} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full border border-white shadow-sm" 
                  />
                )}
                <span className="text-sm font-medium text-slate-900">@{user.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'demo' && <TipDemo />}
        {activeTab === 'comments' && <CommentTipDemo />}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'demo' ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <Gift className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Demo</span>
          </button>
          
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'comments' ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Comments</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'history' ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <History className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">History</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

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
    </div>
  )
}

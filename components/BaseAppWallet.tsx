'use client'

import { useState, useEffect } from 'react'
import { Wallet, Zap, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface BaseAppWalletProps {
  onWalletConnected: (address: string, provider: any) => void
  onWalletDisconnected: () => void
  isConnected: boolean
  userAddress?: string
}

export default function BaseAppWallet({ 
  onWalletConnected, 
  onWalletDisconnected, 
  isConnected, 
  userAddress 
}: BaseAppWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [sdk, setSdk] = useState<any>(null)

  useEffect(() => {
    // Initialize Base app SDK when available
    const initializeBaseApp = async () => {
      try {
        // In a real Base mini app, you'd import and initialize the SDK
        // import { sdk } from '@farcaster/miniapp-sdk'
        // const baseSdk = await sdk.initialize()
        // setSdk(baseSdk)
        
        // For now, simulate the SDK
        console.log('Base app SDK would be initialized here')
        
        // Check if user is already connected
        // const context = await baseSdk.getContext()
        // if (context?.user?.address) {
        //   onWalletConnected(context.user.address, baseSdk)
        // }
        
      } catch (error) {
        console.error('Failed to initialize Base app SDK:', error)
        setError('Failed to connect to Base app wallet')
      }
    }

    initializeBaseApp()
  }, [onWalletConnected])

  useEffect(() => {
    if (isConnected && userAddress) {
      loadBalance()
    }
  }, [isConnected, userAddress])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Use Base app's wallet connection
      // const context = await sdk.getContext()
      // const address = context.user.address
      // onWalletConnected(address, sdk)
      
      // For demo purposes, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockAddress = '0x1234567890123456789012345678901234567890'
      onWalletConnected(mockAddress, sdk)
      
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setError(error.message || 'Failed to connect to Base app wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    onWalletDisconnected()
    setBalance('0')
  }

  const loadBalance = async () => {
    if (!userAddress || !sdk) return

    setIsLoadingBalance(true)
    try {
      // Use Base app's balance API
      // const balance = await sdk.getBalance(userAddress)
      // setBalance(balance)
      
      // For demo purposes, simulate balance
      await new Promise(resolve => setTimeout(resolve, 500))
      setBalance('0.1234')
      
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const sendTip = async (recipientAddress: string, amount: number, message: string) => {
    if (!sdk || !userAddress) {
      throw new Error('Wallet not connected')
    }

    try {
      // Use Base app's payment API
      // const txHash = await sdk.sendPayment({
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

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-base-50 to-base-100 border border-base-200 rounded-xl p-6">
        <div className="text-center">
          <div className="bg-gradient-to-r from-base-500 to-base-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Base App Wallet</h3>
          <p className="text-gray-600 mb-6">
            Connect your Base app wallet to enable auto-tipping features. Your wallet will be used to send tips automatically when you like posts.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full sm:w-auto bg-gradient-to-r from-base-500 to-base-600 text-white font-bold py-3 px-6 rounded-lg hover:from-base-600 hover:to-base-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Connect Base App Wallet</span>
              </>
            )}
          </button>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Base App Integration:</strong> Uses your existing Base app wallet - no additional setup required!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Base App Wallet Connected</h3>
            <p className="text-green-700 text-sm">
              {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
            </p>
          </div>
        </div>
        
        <button
          onClick={disconnectWallet}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-sm text-green-700 mb-1">USDC Balance</p>
          <p className="font-semibold text-green-900">
            {isLoadingBalance ? '...' : `${balance} USDC`}
          </p>
        </div>
        
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-sm text-green-700 mb-1">Network</p>
          <p className="font-semibold text-green-900">Base</p>
        </div>
      </div>

      <div className="bg-white/50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium">Ready for Auto-Tipping!</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Your Base app wallet is connected and ready to send tips automatically when you like posts.
        </p>
      </div>
    </div>
  )
}

// Export the sendTip function for use in other components
export { BaseAppWallet }

'use client'

import { useState, useEffect } from 'react'
import { Wallet, Zap, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface WalletIntegrationProps {
  onWalletConnected: (address: string, provider: any) => void
  onWalletDisconnected: () => void
  isConnected: boolean
  userAddress?: string
}

export default function WalletIntegration({ 
  onWalletConnected, 
  onWalletDisconnected, 
  isConnected, 
  userAddress 
}: WalletIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum

  useEffect(() => {
    if (isConnected && userAddress) {
      loadBalance()
    }
  }, [isConnected, userAddress])

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      onWalletConnected(address, window.ethereum)
      
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    onWalletDisconnected()
    setBalance('0')
  }

  const loadBalance = async () => {
    if (!userAddress || !window.ethereum) return

    setIsLoadingBalance(true)
    try {
      // Get ETH balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAddress, 'latest']
      })
      
      // Convert from wei to ETH
      const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
      setBalance(ethBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const switchToBaseNetwork = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base mainnet
      })
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          })
        } catch (addError) {
          console.error('Failed to add Base network:', addError)
        }
      }
    }
  }

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold text-red-900">MetaMask Required</h3>
        </div>
        <p className="text-red-800 mb-4">
          MetaMask is required to use auto-tipping features. Please install MetaMask to continue.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Install MetaMask</span>
        </a>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-base-50 to-base-100 border border-base-200 rounded-xl p-6">
        <div className="text-center">
          <div className="bg-gradient-to-r from-base-500 to-base-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-6">
            Connect your wallet to enable auto-tipping features. Your wallet will be used to send tips automatically when you like posts.
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
                <span>Connect Wallet</span>
              </>
            )}
          </button>
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
            <h3 className="text-lg font-semibold text-green-900">Wallet Connected</h3>
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
          <p className="text-sm text-green-700 mb-1">ETH Balance</p>
          <p className="font-semibold text-green-900">
            {isLoadingBalance ? '...' : `${balance} ETH`}
          </p>
        </div>
        
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-sm text-green-700 mb-1">Network</p>
          <p className="font-semibold text-green-900">Base</p>
        </div>
      </div>

      <button
        onClick={switchToBaseNetwork}
        className="w-full bg-gradient-to-r from-base-500 to-base-600 text-white font-medium py-2 px-4 rounded-lg hover:from-base-600 hover:to-base-700 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Zap className="h-4 w-4" />
        <span>Switch to Base Network</span>
      </button>
    </div>
  )
}

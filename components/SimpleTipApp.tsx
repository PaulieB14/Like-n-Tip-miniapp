'use client'

import { useState, useEffect } from 'react'
import { Heart, User, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { useAccount, useWalletClient } from 'wagmi'
import { isAddress, getAddress } from 'viem'
import SimpleWallet from './OnchainKitWallet'
import { createX402PaymentFetch } from '@/lib/x402Client'

interface SimpleTipAppProps {
  onTipSent?: (tipData: {
    postId: string
    amount: number
    txHash?: string
    recipient?: string
    postUrl?: string
    postContent?: string
    platform?: string
  }) => void
}

export default function SimpleTipApp({ onTipSent }: SimpleTipAppProps) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [postUrl, setPostUrl] = useState('')
  const [postAuthor, setPostAuthor] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postPlatform, setPostPlatform] = useState('')
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [isSendingTip, setIsSendingTip] = useState(false)
  const [tipSuccess, setTipSuccess] = useState('')
  const [tipError, setTipError] = useState('')

  const quickAmounts = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05]

  // Resolve Farcaster username to wallet address
  const resolveFarcasterAddress = async (username: string): Promise<string | null> => {
    try {
      console.log('Resolving Farcaster username:', username)
      const response = await fetch(`/api/resolve-farcaster-address?username=${username}`)

      if (response.ok) {
        const data = await response.json()
        if (data.address && isAddress(data.address)) {
          return getAddress(data.address)
        }
      }
      return null
    } catch (error) {
      console.error('Error resolving Farcaster address:', error)
      return null
    }
  }

  const loadPost = async () => {
    if (!postUrl.trim()) return

    setIsLoadingPost(true)
    setTipError('')
    setTipSuccess('')

    try {
      const url = new URL(postUrl)
      let username = 'unknown'
      let platform = 'unknown'
      let postId = 'unknown'

      // Parse Farcaster URLs
      if (url.hostname.includes('warpcast.com') || url.hostname.includes('farcaster.xyz')) {
        platform = 'Farcaster'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
      }
      // Parse Base app URLs
      else if (url.hostname.includes('base.org') || url.hostname.includes('base.xyz')) {
        platform = 'Base App'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
      }
      else {
        platform = 'Social Platform'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
      }

      setPostPlatform(platform)
      // Strip common suffixes (.eth, .base, etc.)
      const cleanUsername = username.replace(/\.(eth|base|cb\.id)$/i, '')
      setPostAuthor(cleanUsername)
      setPostContent(`Post from @${cleanUsername} on ${platform} (ID: ${postId})`)
    } catch (error: any) {
      setTipError(error.message || 'Invalid URL format')
    } finally {
      setIsLoadingPost(false)
    }
  }

  const sendTip = async (amount: number) => {
    if (!isConnected || !address || !walletClient) {
      setTipError('Please connect your wallet first')
      return
    }

    if (!postAuthor) {
      setTipError('Please load a post first')
      return
    }

    if (amount <= 0 || amount > 1000) {
      setTipError('Tip amount must be between $0.001 and $1000')
      return
    }

    setIsSendingTip(true)
    setTipError('')
    setTipSuccess('')

    try {
      // Resolve the recipient address
      const recipientAddress = await resolveFarcasterAddress(postAuthor)

      if (!recipientAddress) {
        setTipError(`Could not resolve wallet address for @${postAuthor}`)
        return
      }

      console.log('x402: Sending tip via x402 protocol')
      console.log('Recipient:', recipientAddress)
      console.log('Amount:', amount, 'USDC')

      // Create x402-enabled fetch using the wallet client
      const fetchWithPayment = createX402PaymentFetch(walletClient)

      // Make the tip request - x402 handles the payment flow automatically
      // 1. First request gets 402 with payment requirements
      // 2. Client signs payment with wallet
      // 3. Retry with signed payment header
      // 4. Server verifies and settles via facilitator
      const response = await fetchWithPayment(`/api/tip?userAddress=${address}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postUrl: postUrl,
          amount: amount,
          recipient: recipientAddress,
          recipientUsername: postAuthor
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('x402: Tip successful!', result)

      setTipSuccess(`Tip of $${amount} sent to @${postAuthor} via x402!`)

      // Notify parent component
      onTipSent?.({
        postId: postUrl,
        amount: amount,
        txHash: result.txHash,
        recipient: postAuthor,
        postUrl: postUrl,
        postContent: postContent,
        platform: postPlatform
      })

    } catch (error: any) {
      console.error('Tip error:', error)
      setTipError(error.message || 'Failed to send tip')
    } finally {
      setIsSendingTip(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">x402 Tips</h1>
        <p className="text-slate-600">Send USDC tips to creators via x402 protocol</p>
        <p className="text-sm text-blue-600 mt-2">Works on Farcaster & Base App</p>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">1. Connect Wallet</h3>
        <SimpleWallet />

        {isConnected && address && (
          <div className="mt-4 p-4 rounded-xl border bg-green-50 border-green-200">
            <p className="text-sm font-medium text-green-900">
              ✅ Wallet Connected
            </p>
            <p className="text-xs text-green-700 font-mono mt-1">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        )}
      </div>

      {/* Post URL Input */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">2. Paste Post URL</h3>
        <div className="flex items-center space-x-3">
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://warpcast.com/user/0x123..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={loadPost}
            disabled={!postUrl.trim() || isLoadingPost}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoadingPost ? 'Loading...' : 'Load'}
          </button>
        </div>
      </div>

      {/* Post Preview */}
      {postAuthor && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">3. Post Preview</h3>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <p className="font-semibold text-slate-900">@{postAuthor}</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {postPlatform}
                </span>
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-slate-700">{postContent}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tip Interface */}
      {postAuthor && isConnected && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">4. Send Tip</h3>

          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => sendTip(amount)}
                  disabled={isSendingTip}
                  className="p-3 rounded-xl font-medium transition-all bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50"
                >
                  {isSendingTip ? '...' : `$${amount.toFixed(3)}`}
                </button>
              ))}
            </div>
          </div>

          {tipError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">{tipError}</span>
              </div>
            </div>
          )}

          {tipSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">{tipSuccess}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How x402 Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Connect your wallet (Coinbase Wallet or Farcaster)</p>
          <p>• Paste any post URL from Farcaster or Base app</p>
          <p>• Choose tip amount and sign the payment</p>
          <p>• x402 facilitator settles USDC to creator</p>
        </div>
      </div>
    </div>
  )
}

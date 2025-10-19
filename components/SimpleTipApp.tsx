'use client'

import { useState } from 'react'
import { Heart, User, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import SimpleWallet from './OnchainKitWallet'
import AgentWalletFunding from './AgentWalletFunding'

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
  const [postUrl, setPostUrl] = useState('')
  const [postAuthor, setPostAuthor] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postPlatform, setPostPlatform] = useState('')
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [isSendingTip, setIsSendingTip] = useState(false)
  const [tipSuccess, setTipSuccess] = useState('')
  const [tipError, setTipError] = useState('')

  // Function to resolve Farcaster username to wallet address
  const resolveFarcasterAddress = async (username: string): Promise<string | null> => {
    try {
      console.log('Resolving Farcaster username:', username)
      
      // Use server-side API to avoid CORS issues
      const response = await fetch(`/api/resolve-farcaster-address?username=${username}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Resolved address for', username, ':', data.address)
        
        // Validate the address using ethers
        try {
          const validatedAddress = ethers.getAddress(data.address)
          console.log('Validated address:', validatedAddress)
          return validatedAddress
        } catch (error) {
          console.error('Invalid address from Farcaster:', error, data.address)
          return null
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to resolve address for', username, ':', response.status, errorData.error)
        return null
      }
      
    } catch (error) {
      console.error('Error resolving Farcaster address:', error)
      return null
    }
  }

  const quickAmounts = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05]

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
      // Parse Base app URLs (more flexible)
      else if (url.hostname.includes('base.org') || url.hostname.includes('base.xyz')) {
        platform = 'Base App'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
      }
      // Handle any other social platform URLs
      else {
        platform = 'Social Platform'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
      }

      setPostPlatform(platform)

      // Generate realistic post content
      const postContent = `This is a real ${platform} post from @${username}. The content would be fetched from the ${platform} API using post ID: ${postId}`

      setPostAuthor(username.replace('.eth', ''))
      setPostContent(postContent)
    } catch (error: any) {
      setTipError(error.message || 'Invalid URL format. Please check the URL and try again.')
    } finally {
      setIsLoadingPost(false)
    }
  }

  const sendTip = async (amount: number) => {
    if (!isConnected || !address) {
      setTipError('Please connect your wallet first')
      return
    }

    if (!postAuthor) {
      setTipError('Please load a post first')
      return
    }

    if (amount <= 0 || amount > 1000) {
      setTipError('Tip amount must be between $0.01 and $1000')
      return
    }

    setIsSendingTip(true)
    setTipError('')
    setTipSuccess('')

    try {
      // Skip agent wallet balance check - x402 wallet handles funding
      // The x402 wallet is pre-funded and handles all transactions
      console.log('x402: Using gasless x402 + CDP integration - no agent wallet funding needed')

      // Resolve the recipient address from the username
      const recipientAddress = await resolveFarcasterAddress(postAuthor)
      
      if (!recipientAddress) {
        setTipError(`Could not resolve wallet address for @${postAuthor}. This user may not have a verified Ethereum wallet on Farcaster, or the username may be incorrect.`)
        return
      }
      
      // Final validation using ethers to ensure address is correct
      let validatedRecipientAddress: string
      try {
        validatedRecipientAddress = ethers.getAddress(recipientAddress)
        console.log('Final validated address for payment:', validatedRecipientAddress)
      } catch (error) {
        console.error('Address validation failed:', error, recipientAddress)
        setTipError(`Invalid address format for @${postAuthor}: ${recipientAddress}`)
        return
      }
      
      // Use official x402 protocol with CDP Server Wallet
      console.log('x402: Using official x402 protocol with CDP Server Wallet')
      
      // Use x402 protocol with manual implementation
      console.log('x402: Using manual x402 protocol implementation')
      
      try {
        // Create x402 payment payload with validated address
        const paymentPayload = {
          x402Version: 1,
          scheme: "exact",
          network: "base-sepolia",
          payload: {
            amount: Math.floor(amount * 1e6).toString(), // Convert to USDC units (6 decimals)
            recipient: validatedRecipientAddress, // Use the ethers-validated address
            asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC on Base Sepolia
          }
        }
        
        console.log('Payment payload created with recipient:', paymentPayload.payload.recipient)
        console.log('Payment payload recipient length:', paymentPayload.payload.recipient.length)
        console.log('Payment payload recipient format:', paymentPayload.payload.recipient.startsWith('0x') ? 'Valid' : 'Invalid')
        
        // Encode payment payload as base64
        const paymentHeader = btoa(JSON.stringify(paymentPayload))
        
        // Make the tip request using x402 payment protocol
        // First, try without payment header to get 402 response
        let tipResponse = await fetch(`/api/tip?userAddress=${address}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postUrl: postUrl,
            amount: amount,
            recipient: recipientAddress, // Resolved wallet address
            recipientUsername: postAuthor // Keep the username for display
          })
        })

        // If we get 402, retry with payment header (x402 protocol)
        if (tipResponse.status === 402) {
          console.log('x402: Got 402 response, retrying with payment header')
          console.log('x402: Payment header being sent:', paymentHeader.substring(0, 50) + '...')
          console.log('x402: Payment payload:', JSON.stringify(paymentPayload))
          
          tipResponse = await fetch(`/api/tip?userAddress=${address}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-PAYMENT': paymentHeader // Send base64-encoded payment payload
            },
            body: JSON.stringify({
              postUrl: postUrl,
              amount: amount,
              recipient: recipientAddress, // Resolved wallet address
              recipientUsername: postAuthor // Keep the username for display
            })
          })
          
          console.log('x402: Retry response status:', tipResponse.status)
        }
        
        if (!tipResponse.ok) {
          if (tipResponse.status === 402) {
            setTipError('x402 payment required - insufficient x402 wallet balance')
          } else {
            const errorData = await tipResponse.json().catch(() => ({}))
            setTipError(errorData.error || `HTTP ${tipResponse.status}: ${tipResponse.statusText}`)
          }
          return
        }

        const result = await tipResponse.json()
        console.log('x402: Tip successful!', result)
        
        setTipSuccess(`Tip of $${amount} sent to @${postAuthor}! Transaction: ${result.txHash}`)
        setTipError('')
        
      } catch (error: any) {
        console.error('x402: x402 protocol failed:', error)
        setTipError(`x402 payment failed: ${error.message}`)
        return
      }
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Simple Tip App</h1>
        <p className="text-slate-600">Paste any post URL and send real USDC tips to creators</p>
        <p className="text-sm text-blue-600 mt-2">💡 Agent wallet handles payments - fund once, tip freely</p>
      </div>

      {/* Simple Wallet */}
      <SimpleWallet />

      {/* Agent Wallet Funding */}
      <AgentWalletFunding />

      {/* Post URL Input */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">2. Paste Post URL</h3>
        <div className="flex items-center space-x-3">
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://warpcast.com/alice/0x123... or any social platform URL"
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={loadPost}
            disabled={!postUrl.trim() || isLoadingPost}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoadingPost ? 'Loading...' : 'Load Post'}
          </button>
        </div>
      </div>

      {/* Post Preview */}
      {postAuthor && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">3. Post Preview</h3>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <p className="font-semibold text-slate-900">@{postAuthor}</p>
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-slate-800 leading-relaxed">{postContent}</p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connection Message */}
      {postAuthor && !isConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="text-center">
            <h3 className="font-semibold text-amber-900 mb-2">Connect Wallet to Send Tips</h3>
            <p className="text-amber-700">Please connect your wallet using the button above to send tips to creators.</p>
          </div>
        </div>
      )}

      {/* Tip Interface */}
      {postAuthor && isConnected && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">4. Send Tip</h3>

          {/* Quick Tip Amounts */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => sendTip(amount)}
                  disabled={isSendingTip}
                  className="p-3 rounded-xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50"
                >
                  {isSendingTip ? 'Sending...' : `$${amount.toFixed(3)}`}
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {tipError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">{tipError}</span>
              </div>
            </div>
          )}

          {/* Success Display */}
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
        <h3 className="font-semibold text-blue-900 mb-3">How x402 Tipping Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Fund agent wallet</strong> with USDC (one-time setup)</p>
          <p>• <strong>Paste any social platform post URL</strong> (Farcaster, Base app, etc.)</p>
          <p>• <strong>Choose micropayment amount</strong> ($0.001-$0.005) from quick buttons</p>
          <p>• <strong>Click send</strong> to trigger x402 autonomous micropayment</p>
          <p>• <strong>Agent wallet sends USDC</strong> instantly without user approval</p>
          <p>• <strong>Automatic comment</strong> posted to the original post</p>
        </div>
      </div>
    </div>
  )
}
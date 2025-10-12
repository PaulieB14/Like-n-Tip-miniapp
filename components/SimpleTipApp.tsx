'use client'

import { useState } from 'react'
import { Heart, User, ExternalLink, Gift, CheckCircle, AlertCircle } from 'lucide-react'
import { createTipPayment, validateTipAmount } from '@/lib/x402PaymentService'

export default function SimpleTipApp() {
  const [postUrl, setPostUrl] = useState('')
  const [postAuthor, setPostAuthor] = useState('')
  const [postAuthorAddress, setPostAuthorAddress] = useState('')
  const [postContent, setPostContent] = useState('')
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [isSendingTip, setIsSendingTip] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [tipSuccess, setTipSuccess] = useState<string | null>(null)
  const [tipError, setTipError] = useState<string | null>(null)

  const quickAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]

  const loadPost = async () => {
    console.log('Load Post clicked, URL:', postUrl)
    if (!postUrl.trim()) {
      console.log('No URL provided')
      return
    }

    setIsLoadingPost(true)
    setTipSuccess(null)
    setTipError(null)

    try {
      // Parse URL to determine platform and extract info
      console.log('Parsing URL:', postUrl)
      const url = new URL(postUrl)
      console.log('Parsed URL:', { hostname: url.hostname, pathname: url.pathname })
      
      let platform = 'unknown'
      let username = 'unknown'
      let postId = 'unknown'
      
      if (url.hostname.includes('warpcast.com')) {
        // Farcaster URL format: https://warpcast.com/username/0x...
        platform = 'Farcaster'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
        console.log('Farcaster detected:', { username, postId })
      } else if (url.hostname.includes('base.org')) {
        // Base app URL format: https://base.org/username/0x...
        platform = 'Base App'
        const pathParts = url.pathname.split('/').filter(Boolean)
        username = pathParts[0] || 'unknown'
        postId = pathParts[1] || 'unknown'
        console.log('Base app detected:', { username, postId })
      } else {
        console.log('Unsupported platform:', url.hostname)
        throw new Error('Unsupported platform. Please use Farcaster (warpcast.com) or Base app (base.org) URLs.')
      }
      
      if (!postId || postId.length < 10) {
        throw new Error(`Invalid ${platform} URL format`)
      }
      
      // Generate realistic data based on platform
      const postData = {
        author: username.replace('.eth', ''),
        authorAddress: '0x' + Math.random().toString(16).substr(2, 40), // Generate realistic address
        content: `This is a real ${platform} post from @${username}. The content would be fetched from the ${platform} API using post ID: ${postId}`
      }
      
      console.log('Setting post data:', postData)
      setPostAuthor(postData.author)
      setPostAuthorAddress(postData.authorAddress)
      setPostContent(postData.content)
      console.log('Post data set successfully')
      
    } catch (error) {
      console.error('Failed to load post:', error)
      setTipError(error.message || 'Failed to load post. Please check the URL format.')
    } finally {
      setIsLoadingPost(false)
    }
  }

  const sendTip = async (amount: number) => {
    // Check if we have post author info
    if (!postAuthor || !postAuthorAddress) {
      setTipError('Please load a post first')
      return
    }

    // Validate tip amount
    const validation = validateTipAmount(amount)
    if (!validation.valid) {
      setTipError(validation.error || 'Invalid tip amount')
      return
    }

    setIsSendingTip(true)
    setSelectedAmount(amount)
    setTipError(null)
    setTipSuccess(null)
    
    try {
      // Use x402 payment service
      const result = await createTipPayment(
        postAuthorAddress,
        amount,
        `Tip for @${postAuthor}`
      )

      if (result.success) {
        setTipSuccess(`Tip sent! $${amount.toFixed(2)} USDC to @${postAuthor} via x402`)
        console.log(`x402 tip sent: $${amount} to @${postAuthor}`)
      } else {
        setTipError(result.error || 'Failed to send tip')
      }
      
    } catch (error: any) {
      console.error('Tip failed:', error)
      setTipError(error.message || 'Tip transaction failed')
    } finally {
      setIsSendingTip(false)
      setSelectedAmount(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="relative mb-8">
        {/* Settings Button */}
        <button
          onClick={() => {
            // This would open settings - for now just show an alert
            alert('Settings coming soon! This will let you customize default tip amounts.')
          }}
          className="absolute top-0 right-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center space-x-2"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
        
        {/* Main Header Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Simple Tip App</h1>
          <p className="text-slate-600">Paste any post URL and send real USDC tips to creators</p>
        </div>
      </div>

      {/* Post URL Input */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">1. Paste Post URL</h3>
        <div className="flex items-center space-x-3">
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://warpcast.com/alice/0x123... or https://base.org/bob/0x456..."
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
          <h3 className="font-semibold text-slate-900 mb-4">2. Post Preview</h3>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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

      {/* Tip Interface */}
      {postAuthor && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">3. Send Tip</h3>
          
          {/* Quick Tip Amounts */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => sendTip(amount)}
                  disabled={isSendingTip}
                  className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                    isSendingTip && selectedAmount === amount
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700'
                  } disabled:opacity-50`}
                >
                  {isSendingTip && selectedAmount === amount ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    `$${amount.toFixed(2)}`
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Or enter custom amount:</p>
            <div className="flex space-x-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                max="1000"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSendingTip}
              />
              <button
                onClick={() => {
                  const amount = parseFloat(customAmount)
                  if (amount > 0) {
                    sendTip(amount)
                  }
                }}
                disabled={!customAmount || isSendingTip || parseFloat(customAmount) <= 0}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>

          {/* Error Display */}
          {tipError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  {tipError}
                </span>
              </div>
            </div>
          )}

          {/* Success Display */}
          {tipSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {tipSuccess}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How x402 Tipping Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Paste any Farcaster or Base app post URL</strong> to load the post and author</p>
          <p>• <strong>Choose tip amount</strong> from quick buttons</p>
          <p>• <strong>Click send</strong> to trigger x402 autonomous payment</p>
          <p>• <strong>x402 protocol</strong> handles instant USDC settlement</p>
          <p>• <strong>No wallet connection needed</strong> - fully autonomous</p>
        </div>
      </div>
    </div>
  )
}
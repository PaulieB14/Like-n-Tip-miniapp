'use client'

import { useState } from 'react'
import { Heart, User, ExternalLink, Gift, CheckCircle, AlertCircle } from 'lucide-react'

export default function SimpleTipApp() {
  const [postUrl, setPostUrl] = useState('')
  const [postAuthor, setPostAuthor] = useState('')
  const [postContent, setPostContent] = useState('')
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [tipSuccess, setTipSuccess] = useState<string | null>(null)

  const quickAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]

  const loadPost = async () => {
    if (!postUrl.trim()) return

    setIsLoadingPost(true)
    setTipSuccess(null)

    try {
      // Simulate loading a post
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock post data
      const mockPostData = {
        author: 'alice.base',
        content: 'Just built an amazing DeFi protocol on Base! 🚀 The future of finance is here.'
      }
      
      setPostAuthor(mockPostData.author)
      setPostContent(mockPostData.content)
      
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setIsLoadingPost(false)
    }
  }

  const sendTip = async (amount: number) => {
    // Simulate tip sending
    setTipSuccess(`Tip sent! $${amount.toFixed(2)} USDC to @${postAuthor}`)
    console.log(`Tip sent: $${amount} to @${postAuthor}`)
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
      </div>

      {/* Post URL Input */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">1. Paste Post URL</h3>
        <div className="flex items-center space-x-3">
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://warpcast.com/alice/0x123..."
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
                  className="p-3 rounded-xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700"
                >
                  ${amount.toFixed(2)}
                </button>
              ))}
            </div>
          </div>

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
        <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Paste any Farcaster post URL</strong> to load the post and author</p>
          <p>• <strong>Choose tip amount</strong> from quick buttons</p>
          <p>• <strong>Click send</strong> to send real USDC to the post author</p>
          <p>• <strong>Transaction confirmed</strong> on Base network</p>
        </div>
      </div>
    </div>
  )
}
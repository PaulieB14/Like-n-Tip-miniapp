'use client'

import { useState } from 'react'
import { Heart, User, MessageCircle, Share, Gift } from 'lucide-react'
import PostTipButton from './PostTipButton'

interface TipRecord {
  postId: string
  authorUsername: string
  amount: number
  timestamp: Date
  txHash: string
}

export default function TipDemo() {
  const [recentTips, setRecentTips] = useState<TipRecord[]>([])

  const handleTipSent = (amount: number, txHash: string) => {
    const newTip: TipRecord = {
      postId: 'demo-post-123',
      authorUsername: 'Demo User',
      amount,
      timestamp: new Date(),
      txHash
    }
    setRecentTips(prev => [newTip, ...prev.slice(0, 9)])
  }

  const demoPosts = [
    {
      id: 'post-1',
      author: 'alice.base',
      content: 'Just built an amazing DeFi protocol on Base! 🚀 The future of finance is here.',
      likes: 42,
      comments: 8,
      time: '2h'
    },
    {
      id: 'post-2', 
      author: 'bob.crypto',
      content: 'Sharing some insights about the latest Base ecosystem developments. What do you think?',
      likes: 28,
      comments: 12,
      time: '4h'
    },
    {
      id: 'post-3',
      author: 'charlie.eth',
      content: 'New NFT collection dropping on Base next week! Early access for followers 💎',
      likes: 156,
      comments: 34,
      time: '6h'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tip Demo</h1>
        <p className="text-slate-600">See how manual tip buttons work on posts</p>
      </div>

      {/* Demo Posts */}
      <div className="space-y-6">
        {demoPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">@{post.author}</p>
                <p className="text-sm text-slate-500">{post.time}</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-slate-800 leading-relaxed">{post.content}</p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-600 hover:text-green-500 transition-colors">
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Tip Buttons */}
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4 text-slate-400" />
                <PostTipButton
                  postId={post.id}
                  authorAddress="0x1234567890123456789012345678901234567890"
                  authorUsername={post.author}
                  postContent={post.content}
                  onTipSent={handleTipSent}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tips */}
      {recentTips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Tips</h3>
          <div className="space-y-3">
            {recentTips.map((tip, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gift className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">@{tip.authorUsername}</p>
                    <p className="text-sm text-slate-600">
                      {tip.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${tip.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    {tip.txHash.slice(0, 8)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How Manual Tipping Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Tip buttons on every post</strong> - Users can tip any post directly</p>
          <p>• <strong>Quick amounts</strong> - $0.01, $0.05, $0.10, $0.25, $0.50, $1.00</p>
          <p>• <strong>Custom amounts</strong> - Users can set any tip amount</p>
          <p>• <strong>Instant feedback</strong> - See tips sent immediately</p>
          <p>• <strong>Works with current Base app</strong> - No special integration needed</p>
        </div>
      </div>
    </div>
  )
}

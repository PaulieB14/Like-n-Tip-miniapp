'use client'

import { useState } from 'react'
import { Heart, User, MessageCircle, Share, Gift, CheckCircle } from 'lucide-react'
import CommentWithTip from './CommentWithTip'

interface TipRecord {
  postId: string
  authorUsername: string
  amount: number
  timestamp: Date
  txHash: string
  comment?: string
}

export default function CommentTipDemo() {
  const [recentTips, setRecentTips] = useState<TipRecord[]>([])

  const handleTipSent = (amount: number, recipient: string, txHash: string, comment?: string) => {
    const newTip: TipRecord = {
      postId: 'demo-post-123',
      authorUsername: recipient,
      amount,
      timestamp: new Date(),
      txHash,
      comment
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
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Comment Tipping Demo</h1>
        <p className="text-slate-600">Tip creators by including tip amounts in your comments</p>
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
            <div className="flex items-center justify-between mb-4">
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
            </div>

            {/* Comment with Tip */}
            <div className="border-t border-slate-200 pt-4">
              <CommentWithTip
                postId={post.id}
                postAuthor={post.author}
                postAuthorAddress="0x1234567890123456789012345678901234567890"
                onTipSent={(amount, recipient, txHash) => handleTipSent(amount, recipient, txHash)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tips */}
      {recentTips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Comment Tips</h3>
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
                    {tip.comment && (
                      <p className="text-xs text-slate-500 italic">"{tip.comment}"</p>
                    )}
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
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How Comment Tipping Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Include tip amounts in comments</strong> - Use patterns like "$0.10 tip" or "💖 $0.25"</p>
          <p>• <strong>Automatic detection</strong> - The system parses your comment for tip amounts</p>
          <p>• <strong>Instant processing</strong> - Tips are sent automatically when you comment</p>
          <p>• <strong>Clean comments</strong> - Tip parts are removed from the visible comment</p>
          <p>• <strong>Multiple formats</strong> - Supports $0.10, 0.25 USDC, 25 cents, +$1.00, etc.</p>
        </div>
      </div>

      {/* Supported Patterns */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Supported Tip Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
          <div>
            <p className="font-medium mb-2">Dollar amounts:</p>
            <p>• "$0.10 tip"</p>
            <p>• "tip $0.25"</p>
            <p>• "+$0.50"</p>
          </div>
          <div>
            <p className="font-medium mb-2">USDC amounts:</p>
            <p>• "0.10 USDC"</p>
            <p>• "0.25 USDC tip"</p>
            <p>• "tip 0.50 USDC"</p>
          </div>
          <div>
            <p className="font-medium mb-2">Cents:</p>
            <p>• "10 cents"</p>
            <p>• "25 cents tip"</p>
            <p>• "tip 50 cents"</p>
          </div>
          <div>
            <p className="font-medium mb-2">With emojis:</p>
            <p>• "💖 $0.10"</p>
            <p>• "💰 0.25"</p>
            <p>• "💸 tip $0.50"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Clock, Heart, TrendingUp, Users } from 'lucide-react'

interface Tip {
  id: string
  recipient: string
  amount: number
  message: string
  emoji: string
  timestamp: Date
  status: 'sent' | 'received'
}

export default function TipHistory() {
  const [tips, setTips] = useState<Tip[]>([])
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')

  useEffect(() => {
    // Mock data for demonstration
    const mockTips: Tip[] = [
      {
        id: '1',
        recipient: '@alice',
        amount: 5.00,
        message: "You're amazing! 🚀",
        emoji: '🚀',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'sent'
      },
      {
        id: '2',
        recipient: '@bob',
        amount: 2.50,
        message: "Keep crushing it! 💪",
        emoji: '💪',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'sent'
      },
      {
        id: '3',
        recipient: '@charlie',
        amount: 10.00,
        message: "Thanks for the great content! ✨",
        emoji: '✨',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'received'
      },
      {
        id: '4',
        recipient: '@diana',
        amount: 1.00,
        message: "Love this! 💖",
        emoji: '💖',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        status: 'sent'
      }
    ]
    setTips(mockTips)
  }, [])

  const sentTips = tips.filter(tip => tip.status === 'sent')
  const receivedTips = tips.filter(tip => tip.status === 'received')

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const totalSent = sentTips.reduce((sum, tip) => sum + tip.amount, 0)
  const totalReceived = receivedTips.reduce((sum, tip) => sum + tip.amount, 0)

  return (
    <div className="tip-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Tip History</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'sent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({sentTips.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'received'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received ({receivedTips.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-base-50 to-base-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-base-500" />
            <span className="text-sm font-medium text-gray-600">Total Sent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalSent.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Total Received</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalReceived.toFixed(2)}</p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {(activeTab === 'sent' ? sentTips : receivedTips).map((tip) => (
          <div
            key={tip.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{tip.emoji}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {tip.status === 'sent' ? 'To' : 'From'} {tip.recipient}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(tip.timestamp)}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">{tip.message}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-900">
                ${tip.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">USDC</p>
            </div>
          </div>
        ))}

        {(activeTab === 'sent' ? sentTips : receivedTips).length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💭</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} tips yet
            </h4>
            <p className="text-gray-600">
              {activeTab === 'sent' 
                ? "Start spreading joy by sending your first tip!" 
                : "Tips you receive will appear here."
              }
            </p>
          </div>
        )}
      </div>

      {/* Group Chat Focus */}
      <div className="mt-8 p-4 bg-gradient-to-r from-base-50 to-base-100 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-base-500" />
          <h4 className="font-medium text-base-900">Perfect for Group Chats!</h4>
        </div>
        <p className="text-sm text-base-700">
          Share this app in your Base app group chats to make tipping fun and social. 
          Great for creator communities, gaming groups, and social circles!
        </p>
      </div>
    </div>
  )
}

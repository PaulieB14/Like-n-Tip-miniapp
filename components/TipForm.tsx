'use client'

import { useState } from 'react'
import { Heart, Send, DollarSign, Sparkles } from 'lucide-react'

const CATCHY_MESSAGES = [
  "You're amazing! 🚀",
  "Keep crushing it! 💪",
  "This made my day! ✨",
  "You're a legend! 👑",
  "Thanks for being awesome! 🌟",
  "You rock! 🎸",
  "Incredible work! 🎯",
  "You're the best! 🏆",
  "Love this! 💖",
  "So helpful! 🤝",
  "Brilliant! 🧠",
  "Perfect! ✅"
]

const EMOJIS = ['💖', '🚀', '⭐', '🎉', '🔥', '💎', '🌈', '🎯', '💪', '✨', '👑', '🌟', '🎊', '💫', '🎁', '🏆']

export default function TipForm() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💖')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    setIsLoading(true)
    
    try {
      // TODO: Implement x402 payment flow
      console.log('Sending tip:', { recipient, amount, message, emoji: selectedEmoji })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success animation
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Reset form
      setRecipient('')
      setAmount('')
      setMessage('')
      setSelectedEmoji('💖')
      
    } catch (error) {
      console.error('Failed to send tip:', error)
      alert('Failed to send tip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickMessage = (msg: string) => {
    setMessage(msg)
  }

  return (
    <div className="tip-card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Tip</h3>
        <p className="text-gray-600">Perfect for group chats and showing appreciation!</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            <span className="text-green-800 font-medium">Tip sent successfully! 🎉</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSendTip} className="space-y-6">
        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Username
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tip Amount (USDC)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Quick Messages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Messages
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATCHY_MESSAGES.map((msg, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickMessage(msg)}
                className="catchy-message"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a personal message..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
          />
        </div>

        {/* Emoji Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an Emoji
          </label>
          <div className="emoji-picker">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`text-2xl p-2 rounded-lg transition-all duration-200 ${
                  selectedEmoji === emoji 
                    ? 'bg-base-100 ring-2 ring-base-500 scale-110' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !recipient || !amount}
          className="w-full tip-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Tip {selectedEmoji}</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Heart, Zap, DollarSign } from 'lucide-react'

interface LikeToTipProps {
  postId?: string
  authorUsername?: string
  authorAddress?: string
  postContent?: string
}

export default function LikeToTip({ 
  postId = 'sample-post-123',
  authorUsername = '@alice',
  authorAddress = '0x1234567890123456789012345678901234567890',
  postContent = 'Check out this amazing Base app! 🚀'
}: LikeToTipProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleLikeClick = () => {
    if (!isLiked) {
      // First click: Like the post
      setIsLiked(true)
      // Show tip modal after a short delay
      setTimeout(() => {
        setShowTipModal(true)
      }, 500)
    } else {
      // Second click: Unlike
      setIsLiked(false)
    }
  }

  const handleTipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipAmount) return

    setIsProcessing(true)
    
    try {
      // TODO: Implement actual tip sending
      console.log('Sending tip:', {
        postId,
        authorUsername,
        authorAddress,
        amount: tipAmount,
        message: `Liked your post: "${postContent.substring(0, 50)}..."`
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowTipModal(false)
      setTipAmount('')
      
      // Show success message
      alert(`Tip sent to ${authorUsername}! 🎉`)
      
    } catch (error) {
      console.error('Failed to send tip:', error)
      alert('Failed to send tip. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Like Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">
            {isLiked ? 'Liked!' : 'Like'}
          </span>
        </button>
        
        {isLiked && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Tip ready!</span>
          </div>
        )}
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-base-500 to-base-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Send a Tip!
              </h3>
              <p className="text-gray-600">
                You liked <span className="font-medium text-base-600">{authorUsername}</span>'s post
              </p>
              <p className="text-sm text-gray-500 mt-2">
                "{postContent.substring(0, 60)}..."
              </p>
            </div>

            <form onSubmit={handleTipSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip Amount (USDC)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['1', '5', '10', '25'].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className="p-2 text-sm bg-gray-100 hover:bg-base-100 border border-gray-200 rounded-lg transition-colors duration-200"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTipModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !tipAmount}
                  className="flex-1 bg-gradient-to-r from-base-500 to-base-600 text-white font-bold py-3 px-4 rounded-lg hover:from-base-600 hover:to-base-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    `Send $${tipAmount}`
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> This creates a seamless like-to-tip experience perfect for Base app posts!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

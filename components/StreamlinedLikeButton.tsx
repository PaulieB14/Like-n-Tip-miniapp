'use client'

import { useState } from 'react'
import { Heart, Zap, CheckCircle } from 'lucide-react'
import { AutoTipSettings } from './AutoTipSettings'

interface StreamlinedLikeButtonProps {
  postId: string
  authorAddress: string
  authorUsername?: string
  postContent?: string
  autoTipSettings: AutoTipSettings
}

export default function StreamlinedLikeButton({ 
  postId,
  authorAddress,
  authorUsername = 'Base User',
  postContent = 'Amazing post!',
  autoTipSettings
}: StreamlinedLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLikeClick = async () => {
    if (isLiked) {
      // Unlike
      setIsLiked(false)
      return
    }

    setIsProcessing(true)
    
    try {
      // Like the post
      setIsLiked(true)
      
      // If auto-tip is enabled, send tip automatically
      if (autoTipSettings.enabled && autoTipSettings.defaultAmount > 0) {
        console.log('Auto-sending tip:', {
          postId,
          authorAddress,
          amount: autoTipSettings.defaultAmount,
          message: `Liked your post! 💖`
        })
        
        // TODO: Implement actual tip sending via x402
        // For now, simulate the API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Show success feedback
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
      
    } catch (error) {
      console.error('Failed to like/tip:', error)
      setIsLiked(false) // Revert like on error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLikeClick}
        disabled={isProcessing}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
          isLiked 
            ? 'bg-red-500 text-white shadow-lg transform scale-105' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        ) : (
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        )}
        <span className="font-medium">
          {isProcessing ? 'Sending...' : isLiked ? 'Liked!' : 'Like'}
        </span>
      </button>
      
      {/* Auto-tip indicator */}
      {autoTipSettings.enabled && autoTipSettings.defaultAmount > 0 && (
        <div className="flex items-center space-x-1 text-sm">
          {showSuccess ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Tip sent!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-500">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>${autoTipSettings.defaultAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

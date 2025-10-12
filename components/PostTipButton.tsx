'use client'

import { useState } from 'react'
import { Heart, Gift, Zap, CheckCircle } from 'lucide-react'

interface PostTipButtonProps {
  postId: string
  authorAddress: string
  authorUsername: string
  postContent?: string
  onTipSent?: (amount: number, txHash: string) => void
}

export default function PostTipButton({ 
  postId,
  authorAddress,
  authorUsername,
  postContent = 'Amazing post!',
  onTipSent
}: PostTipButtonProps) {
  const [isTipping, setIsTipping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const quickAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]

  const sendTip = async (amount: number) => {
    setIsTipping(true)
    setSelectedAmount(amount)
    
    try {
      // Simulate tip transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`
      
      // Show success
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Callback to parent
      onTipSent?.(amount, mockTxHash)
      
      console.log(`Tip sent: $${amount} to ${authorUsername} - TX: ${mockTxHash}`)
      
    } catch (error) {
      console.error('Tip failed:', error)
    } finally {
      setIsTipping(false)
      setSelectedAmount(null)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Tip sent!</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Quick tip amounts */}
      {quickAmounts.map((amount) => (
        <button
          key={amount}
          onClick={() => sendTip(amount)}
          disabled={isTipping}
          className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
            isTipping && selectedAmount === amount
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
          } disabled:opacity-50`}
        >
          {isTipping && selectedAmount === amount ? (
            <div className="flex items-center space-x-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              <span>Sending...</span>
            </div>
          ) : (
            `$${amount.toFixed(2)}`
          )}
        </button>
      ))}
      
      {/* Custom amount button */}
      <button
        onClick={() => sendTip(0.10)} // Default custom amount
        disabled={isTipping}
        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-1"
      >
        <Gift className="h-3 w-3" />
        <span>Custom</span>
      </button>
    </div>
  )
}

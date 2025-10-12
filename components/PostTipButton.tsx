'use client'

import { useState } from 'react'
import { Heart, Gift, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { createPaymentService, validateTipAmount } from '@/lib/paymentService'
import { useAccount, useWriteContract } from 'wagmi'

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
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [isTipping, setIsTipping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [tipError, setTipError] = useState<string | null>(null)

  const quickAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]

  const sendTip = async (amount: number) => {
    // Check if wallet is connected
    if (!isConnected || !address) {
      setTipError('Please connect your wallet to send tips')
      return
    }

    // Validate tip amount
    const validation = validateTipAmount(amount)
    if (!validation.valid) {
      setTipError(validation.error || 'Invalid tip amount')
      return
    }

    setIsTipping(true)
    setSelectedAmount(amount)
    setTipError(null)
    
    try {
      // Create payment service
      const paymentService = createPaymentService(writeContract, address)
      
      // Send real tip
      const result = await paymentService.sendTip({
        recipientAddress: authorAddress,
        amount: amount,
        message: `Tip for ${authorUsername}`
      })

      if (result.success && result.txHash) {
        // Show success
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        
        // Callback to parent
        onTipSent?.(amount, result.txHash)
        
        console.log(`Real tip sent: $${amount} to ${authorUsername} - TX: ${result.txHash}`)
      } else {
        setTipError(result.error || 'Failed to send tip')
      }
      
    } catch (error: any) {
      console.error('Tip failed:', error)
      setTipError(error.message || 'Tip transaction failed')
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
    <div className="space-y-2">
      {/* Error Display */}
      {tipError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-900">
              {tipError}
            </span>
          </div>
        </div>
      )}

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-900">
              Connect wallet to send real tips
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Quick tip amounts */}
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => sendTip(amount)}
            disabled={isTipping || !isConnected}
            className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
              isTipping && selectedAmount === amount
                ? 'bg-blue-500 text-white'
                : isConnected
                ? 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
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
          disabled={isTipping || !isConnected}
          className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 disabled:opacity-50 flex items-center space-x-1 ${
            isConnected
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Gift className="h-3 w-3" />
          <span>Custom</span>
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { MessageCircle, Send, Gift, CheckCircle, AlertCircle } from 'lucide-react'
import { parseCommentForTip, formatTipAmount, type CommentTipResult } from '@/lib/commentTipParser'
import { createPaymentService, validateTipAmount, type TipResult } from '@/lib/paymentService'
import { useAccount, useWriteContract } from 'wagmi'

interface CommentWithTipProps {
  postId: string
  postAuthor: string
  postAuthorAddress: string
  onTipSent?: (amount: number, recipient: string, txHash: string) => void
}

export default function CommentWithTip({ 
  postId,
  postAuthor,
  postAuthorAddress,
  onTipSent
}: CommentWithTipProps) {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTipPreview, setShowTipPreview] = useState(false)
  const [tipResult, setTipResult] = useState<CommentTipResult | null>(null)
  const [submittedComment, setSubmittedComment] = useState('')
  const [tipError, setTipError] = useState<string | null>(null)

  const handleCommentChange = (value: string) => {
    setComment(value)
    
    // Parse for tips in real-time
    const result = parseCommentForTip(value)
    setTipResult(result)
    setShowTipPreview(result.hasTip)
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return

    // Check if wallet is connected
    if (!isConnected || !address) {
      setTipError('Please connect your wallet to send tips')
      return
    }

    setIsSubmitting(true)
    setTipError(null)
    
    try {
      // If there's a tip, process it first
      if (tipResult?.hasTip && tipResult.tip) {
        // Validate tip amount
        const validation = validateTipAmount(tipResult.tip.amount)
        if (!validation.valid) {
          setTipError(validation.error || 'Invalid tip amount')
          setIsSubmitting(false)
          return
        }

        // Create payment service
        const paymentService = createPaymentService(writeContract, address)
        
        // Send real tip
        const paymentResult = await paymentService.sendTip({
          recipientAddress: postAuthorAddress,
          amount: tipResult.tip.amount,
          message: tipResult.tip.message
        })

        if (paymentResult.success && paymentResult.txHash) {
          // Callback to parent
          onTipSent?.(tipResult.tip.amount, postAuthor, paymentResult.txHash)
          console.log(`Real tip sent: ${formatTipAmount(tipResult.tip.amount)} to @${postAuthor} - TX: ${paymentResult.txHash}`)
        } else {
          setTipError(paymentResult.error || 'Failed to send tip')
          setIsSubmitting(false)
          return
        }
      }
      
      // Submit the cleaned comment (without tip part)
      const finalComment = tipResult?.cleanedComment || comment
      setSubmittedComment(finalComment)
      
      // Reset form
      setComment('')
      setTipResult(null)
      setShowTipPreview(false)
      
    } catch (error: any) {
      console.error('Failed to submit comment:', error)
      setTipError(error.message || 'Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Comment Input - Mobile Optimized */}
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-3 w-3 text-white" />
          </div>
          
          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder={`Comment on @${postAuthor}... (try "$0.10 tip" or "💖 $0.25")`}
              className="w-full p-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              rows={2}
              disabled={isSubmitting}
            />
            
            {/* Tip Preview - Mobile Optimized */}
            {showTipPreview && tipResult?.tip && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Gift className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-900">
                    Tip: {formatTipAmount(tipResult.tip.amount)} to @{postAuthor}
                  </span>
                </div>
                {tipResult.cleanedComment && (
                  <p className="text-xs text-green-700 mt-1">
                    "{tipResult.cleanedComment}"
                  </p>
                )}
                {!isConnected && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Connect wallet to send real tips
                  </p>
                )}
              </div>
            )}

            {/* Error Display */}
            {tipError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3 text-red-600" />
                  <span className="text-xs font-medium text-red-900">
                    {tipError}
                  </span>
                </div>
              </div>
            )}
            
            {/* Submit Button - Mobile Optimized */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-500 hidden sm:block">
                Examples: "$0.10 tip", "💖 $0.25"
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Comment */}
      {submittedComment && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800">{submittedComment}</p>
              <p className="text-xs text-slate-500 mt-1">Just now</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </div>
      )}

      {/* Tip Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tip Examples</h4>
        <div className="grid grid-cols-1 gap-2 text-sm text-blue-800">
          <p>• <code>"Great post! $0.10 tip"</code></p>
          <p>• <code>"Amazing work! 💖 $0.25"</code></p>
          <p>• <code>"Here's 0.50 USDC for this"</code></p>
          <p>• <code>"Love this! +$1.00"</code></p>
          <p>• <code>"Sending 25 cents your way"</code></p>
        </div>
      </div>
    </div>
  )
}

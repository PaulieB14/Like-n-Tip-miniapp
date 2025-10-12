'use client'

import { useState } from 'react'
import { MessageCircle, Send, Gift, CheckCircle, AlertCircle } from 'lucide-react'
import { parseCommentForTip, formatTipAmount, type CommentTipResult } from '@/lib/commentTipParser'

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
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTipPreview, setShowTipPreview] = useState(false)
  const [tipResult, setTipResult] = useState<CommentTipResult | null>(null)
  const [submittedComment, setSubmittedComment] = useState('')

  const handleCommentChange = (value: string) => {
    setComment(value)
    
    // Parse for tips in real-time
    const result = parseCommentForTip(value)
    setTipResult(result)
    setShowTipPreview(result.hasTip)
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    
    try {
      // Simulate comment submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // If there's a tip, process it
      if (tipResult?.hasTip && tipResult.tip) {
        // Simulate tip transaction
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`
        
        // Callback to parent
        onTipSent?.(tipResult.tip.amount, postAuthor, mockTxHash)
        
        console.log(`Tip sent: ${formatTipAmount(tipResult.tip.amount)} to @${postAuthor} - TX: ${mockTxHash}`)
      }
      
      // Submit the cleaned comment (without tip part)
      const finalComment = tipResult?.cleanedComment || comment
      setSubmittedComment(finalComment)
      
      // Reset form
      setComment('')
      setTipResult(null)
      setShowTipPreview(false)
      
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder={`Comment on @${postAuthor}'s post... (include tip amounts like "$0.10 tip" or "💖 $0.25")`}
              className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
              disabled={isSubmitting}
            />
            
            {/* Tip Preview */}
            {showTipPreview && tipResult?.tip && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Tip detected: {formatTipAmount(tipResult.tip.amount)} to @{postAuthor}
                  </span>
                </div>
                {tipResult.cleanedComment && (
                  <p className="text-sm text-green-700 mt-1">
                    Comment: "{tipResult.cleanedComment}"
                  </p>
                )}
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-slate-500">
                Tip examples: "$0.10 tip", "💖 $0.25", "0.50 USDC", "+$1.00"
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
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

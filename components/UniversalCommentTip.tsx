'use client'

import { useState } from 'react'
import { MessageCircle, Send, Gift, CheckCircle, AlertCircle, Link, User, ExternalLink } from 'lucide-react'
import { parseCommentForTip, formatTipAmount, type CommentTipResult } from '@/lib/commentTipParser'
import { createPaymentService, validateTipAmount, type TipResult } from '@/lib/paymentService'
import { useAccount, useWriteContract } from 'wagmi'

interface UniversalCommentTipProps {
  onTipSent?: (amount: number, recipient: string, txHash: string, postUrl?: string) => void
}

export default function UniversalCommentTip({ onTipSent }: UniversalCommentTipProps) {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [postUrl, setPostUrl] = useState('')
  const [postAuthor, setPostAuthor] = useState('')
  const [postAuthorAddress, setPostAuthorAddress] = useState('')
  const [postContent, setPostContent] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTipPreview, setShowTipPreview] = useState(false)
  const [tipResult, setTipResult] = useState<CommentTipResult | null>(null)
  const [submittedComment, setSubmittedComment] = useState('')
  const [tipError, setTipError] = useState<string | null>(null)
  const [isParsingUrl, setIsParsingUrl] = useState(false)

  const handleCommentChange = (value: string) => {
    setComment(value)
    
    // Parse for tips in real-time
    const result = parseCommentForTip(value)
    setTipResult(result)
    setShowTipPreview(result.hasTip)
  }

  const parsePostUrl = async (url: string) => {
    if (!url.trim()) return

    setIsParsingUrl(true)
    setTipError(null)

    try {
      // For demo purposes, we'll simulate parsing a Farcaster post URL
      // In a real implementation, this would:
      // 1. Parse the URL to extract post ID
      // 2. Fetch post data from Farcaster API
      // 3. Extract author information and content
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock post data - in reality this would come from Farcaster API
      const mockPostData = {
        author: 'alice.base',
        authorAddress: '0x1234567890123456789012345678901234567890',
        content: 'Check out this amazing Base app! 🚀 The future of finance is here.'
      }
      
      setPostAuthor(mockPostData.author)
      setPostAuthorAddress(mockPostData.authorAddress)
      setPostContent(mockPostData.content)
      
    } catch (error: any) {
      console.error('Failed to parse post URL:', error)
      setTipError('Failed to load post. Please check the URL and try again.')
    } finally {
      setIsParsingUrl(false)
    }
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return

    // Check if wallet is connected
    if (!isConnected || !address) {
      setTipError('Please connect your wallet to send tips')
      return
    }

    // Check if we have post author info
    if (!postAuthor || !postAuthorAddress) {
      setTipError('Please enter a valid post URL first')
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
          onTipSent?.(tipResult.tip.amount, postAuthor, paymentResult.txHash, postUrl)
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
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Universal Comment Tipping</h1>
        <p className="text-slate-600">Tip any creator by commenting on their posts</p>
      </div>

      {/* Post URL Input */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-3">1. Enter Post URL</h3>
        <div className="flex items-center space-x-2">
          <Link className="h-4 w-4 text-slate-400" />
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://warpcast.com/alice/0x123..."
            className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={() => parsePostUrl(postUrl)}
            disabled={!postUrl.trim() || isParsingUrl}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
          >
            {isParsingUrl ? 'Loading...' : 'Load'}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Paste any Farcaster post URL to start tipping
        </p>
      </div>

      {/* Post Preview */}
      {postAuthor && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">2. Post Preview</h3>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-slate-900">@{postAuthor}</p>
                <a 
                  href={postUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed">{postContent}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comment with Tip */}
      {postAuthor && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">3. Comment & Tip</h3>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-white" />
            </div>
            
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder={`Comment on @${postAuthor}'s post... (try "$0.10 tip" or "💖 $0.25")`}
                className="w-full p-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                rows={3}
                disabled={isSubmitting}
              />
              
              {/* Tip Preview */}
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
              
              {/* Submit Button */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-slate-500">
                  Examples: "$0.10 tip", "💖 $0.25", "0.50 USDC"
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!comment.trim() || isSubmitting || !isConnected}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Comment & Tip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Comment */}
      {submittedComment && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800 text-sm">{submittedComment}</p>
              <p className="text-xs text-slate-500 mt-1">Just now</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How Universal Comment Tipping Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Paste any Farcaster post URL</strong> to load the post and author info</p>
          <p>• <strong>Write your comment</strong> and include tip amounts like "$0.10 tip"</p>
          <p>• <strong>System detects tips automatically</strong> and sends real USDC</p>
          <p>• <strong>Clean comment is posted</strong> without the tip part</p>
          <p>• <strong>Works with any post</strong> - no need to be in the original thread</p>
        </div>
      </div>
    </div>
  )
}

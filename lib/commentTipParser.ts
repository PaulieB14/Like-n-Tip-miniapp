// Comment tip parser - detects tip amounts in comments

export interface ParsedTip {
  amount: number
  currency: string
  message: string
  isValid: boolean
}

export interface CommentTipResult {
  hasTip: boolean
  tip?: ParsedTip
  originalComment: string
  cleanedComment: string
}

// Common tip patterns to detect
const tipPatterns = [
  // "$0.10 tip", "tip $0.25", "+$0.50"
  /\$(\d+\.?\d*)\s*(?:tip|tipped?)/gi,
  /(?:tip|tipped?)\s*\$(\d+\.?\d*)/gi,
  /\+\$(\d+\.?\d*)/gi,
  
  // "0.10 USDC", "0.25 USDC tip"
  /(\d+\.?\d*)\s*USDC\s*(?:tip|tipped?)?/gi,
  /(?:tip|tipped?)\s*(\d+\.?\d*)\s*USDC/gi,
  
  // "10 cents", "25 cents tip"
  /(\d+)\s*cents?\s*(?:tip|tipped?)?/gi,
  /(?:tip|tipped?)\s*(\d+)\s*cents?/gi,
  
  // "💖 $0.10", "💸 0.25", "💰 tip $0.50"
  /[💖💸💰🎁]\s*\$?(\d+\.?\d*)/gi,
  /[💖💸💰🎁]\s*(?:tip|tipped?)\s*\$?(\d+\.?\d*)/gi,
  
  // "send 0.10", "send $0.25"
  /send\s*\$?(\d+\.?\d*)/gi,
  
  // "here's 0.10", "here's $0.25"
  /here'?s\s*\$?(\d+\.?\d*)/gi,
]

export function parseCommentForTip(comment: string): CommentTipResult {
  const originalComment = comment.trim()
  let cleanedComment = originalComment
  let detectedTip: ParsedTip | undefined

  // Check each pattern
  for (const pattern of tipPatterns) {
    const matches = [...comment.matchAll(pattern)]
    
    if (matches.length > 0) {
      // Take the first match
      const match = matches[0]
      const amountStr = match[1]
      const amount = parseFloat(amountStr)
      
      // Validate amount (between $0.01 and $100)
      if (amount >= 0.01 && amount <= 100) {
        detectedTip = {
          amount,
          currency: 'USDC',
          message: originalComment,
          isValid: true
        }
        
        // Remove the tip part from the comment
        cleanedComment = originalComment.replace(match[0], '').trim()
        break
      }
    }
  }

  return {
    hasTip: !!detectedTip,
    tip: detectedTip,
    originalComment,
    cleanedComment
  }
}

// Helper function to format tip amount
export function formatTipAmount(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Helper function to generate tip confirmation message
export function generateTipConfirmation(amount: number, recipient: string): string {
  return `💖 Tip sent! ${formatTipAmount(amount)} to @${recipient}`
}

// Example usage and test cases
export const testComments = [
  "Great post! $0.10 tip",
  "Amazing work! 💖 $0.25",
  "Here's 0.50 USDC for this",
  "tip $1.00",
  "Love this! +$0.05",
  "Sending 25 cents your way",
  "💰 tip $0.75",
  "This is awesome! No tip here",
  "Just a regular comment",
  "💸 0.15 USDC tip"
]

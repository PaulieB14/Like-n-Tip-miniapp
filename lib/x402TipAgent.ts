// x402 Tip Agent - Autonomous payment agent for Farcaster conversations
// Based on https://github.com/coinbase/x402 protocol

export interface TipContext {
  conversationId: string;
  messageId: string;
  authorAddress: string;
  authorDisplayName: string;
  postUrl?: string;
  content: string;
}

export interface TipRequest {
  recipientAddress: string;
  amount: number; // in USD
  message?: string;
  context: TipContext;
}

export interface TipAgentResponse {
  success: boolean;
  miniAppUrl?: string;
  message?: string;
  error?: string;
}

export class X402TipAgent {
  private miniAppBaseUrl: string;
  private facilitatorUrl: string;

  constructor(miniAppBaseUrl: string, facilitatorUrl?: string) {
    this.miniAppBaseUrl = miniAppBaseUrl;
    this.facilitatorUrl = facilitatorUrl || 'https://facilitator.x402.org';
  }

  // Detect if conversation context suggests tipping opportunity
  detectTipContext(message: string, conversation: any): TipContext | null {
    const content = message.toLowerCase();
    
    // Tip-related keywords
    const tipKeywords = [
      'tip', 'donate', 'support', 'appreciate', 'thanks', 'amazing', 'great work',
      'love this', 'incredible', 'brilliant', 'genius', 'helpful', 'useful'
    ];
    
    // Check if message contains tip-related sentiment
    const hasTipSentiment = tipKeywords.some(keyword => content.includes(keyword));
    
    if (hasTipSentiment) {
      return {
        conversationId: conversation.id,
        messageId: conversation.lastMessageId,
        authorAddress: conversation.lastMessageAuthor,
        authorDisplayName: conversation.lastMessageAuthorName || 'Anonymous',
        content: message,
        postUrl: this.extractPostUrl(message)
      };
    }
    
    return null;
  }

  // Generate tip mini app URL with context
  generateTipMiniAppUrl(context: TipContext, amount?: number): string {
    const params = new URLSearchParams({
      recipient: context.authorAddress,
      context: context.conversationId,
      author: context.authorDisplayName,
      ...(amount && { amount: amount.toString() }),
      ...(context.postUrl && { postUrl: context.postUrl })
    });
    
    return `${this.miniAppBaseUrl}/tip?${params.toString()}`;
  }

  // Agent response for tip context detection
  async handleTipContext(context: TipContext): Promise<TipAgentResponse> {
    try {
      const miniAppUrl = this.generateTipMiniAppUrl(context);
      
      return {
        success: true,
        miniAppUrl,
        message: `💝 Want to tip @${context.authorDisplayName}? Tap to send a tip:\n\n${miniAppUrl}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tip link'
      };
    }
  }

  // Process tip payment using x402 protocol
  async processTipPayment(tipRequest: TipRequest): Promise<TipAgentResponse> {
    try {
      // Step 1: Create x402 payment request
      const paymentRequest = await this.createX402PaymentRequest(tipRequest);
      
      // Step 2: Send to facilitator for settlement
      const settlementResponse = await this.settlePayment(paymentRequest);
      
      if (settlementResponse.success) {
        return {
          success: true,
          message: `✅ Tip sent! $${tipRequest.amount} USDC to @${tipRequest.context.authorDisplayName}`
        };
      } else {
        return {
          success: false,
          error: settlementResponse.error || 'Payment settlement failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tip payment failed'
      };
    }
  }

  // Create x402 payment request
  private async createX402PaymentRequest(tipRequest: TipRequest) {
    return {
      x402Version: 1,
      scheme: 'exact',
      network: '8453', // Base mainnet
      payload: {
        to: tipRequest.recipientAddress,
        amount: this.convertToAtomicUnits(tipRequest.amount),
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        message: tipRequest.message || `Tip for @${tipRequest.context.authorDisplayName}`
      }
    };
  }

  // Settle payment through x402 facilitator
  private async settlePayment(paymentRequest: any) {
    const response = await fetch(`${this.facilitatorUrl}/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest)
    });

    return await response.json();
  }

  // Convert USD to atomic units (USDC has 6 decimals)
  private convertToAtomicUnits(amount: number): string {
    return (amount * 1000000).toString();
  }

  // Extract Farcaster post URL from message
  private extractPostUrl(message: string): string | undefined {
    const urlRegex = /https?:\/\/warpcast\.com\/[^\s]+/g;
    const match = message.match(urlRegex);
    return match ? match[0] : undefined;
  }

  // Generate agent conversation responses
  generateAgentResponses(context: TipContext): string[] {
    const responses = [
      `💝 @${context.authorDisplayName} shared something awesome! Want to show appreciation?`,
      `🎯 Perfect moment to tip @${context.authorDisplayName} for their contribution!`,
      `✨ @${context.authorDisplayName} deserves recognition! Send a tip to show support.`,
      `🚀 @${context.authorDisplayName} created value - tip them to show appreciation!`
    ];
    
    return responses;
  }
}

// Agent behavior patterns based on Base documentation
export class TipAgentBehavior {
  private agent: X402TipAgent;
  private conversationHistory: Map<string, any[]> = new Map();

  constructor(agent: X402TipAgent) {
    this.agent = agent;
  }

  // Main agent message handler
  async handleMessage(message: string, conversation: any): Promise<TipAgentResponse | null> {
    const conversationId = conversation.id;
    
    // Track conversation history
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, []);
    }
    
    const history = this.conversationHistory.get(conversationId)!;
    history.push({ message, timestamp: Date.now() });
    
    // Keep only last 10 messages
    if (history.length > 10) {
      history.shift();
    }

    // Detect tip context
    const tipContext = this.agent.detectTipContext(message, conversation);
    
    if (tipContext) {
      // Check if we've already suggested tipping recently
      const recentTipSuggestions = history.filter(
        h => h.timestamp > Date.now() - 300000 && h.type === 'tip_suggestion' // 5 minutes
      );
      
      if (recentTipSuggestions.length === 0) {
        return await this.agent.handleTipContext(tipContext);
      }
    }

    return null;
  }

  // Handle direct tip requests
  async handleDirectTipRequest(message: string, conversation: any): Promise<TipAgentResponse | null> {
    const content = message.toLowerCase();
    
    if (content.includes('tip') && (content.includes('@') || content.includes('send'))) {
      // Extract recipient and amount from message
      const amountMatch = content.match(/\$?(\d+\.?\d*)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1.0;
      
      // This would need more sophisticated parsing in a real implementation
      const tipRequest: TipRequest = {
        recipientAddress: conversation.lastMessageAuthor,
        amount,
        message: `Tip from conversation`,
        context: {
          conversationId: conversation.id,
          messageId: conversation.lastMessageId,
          authorAddress: conversation.lastMessageAuthor,
          authorDisplayName: conversation.lastMessageAuthorName || 'Anonymous',
          content: message
        }
      };
      
      return await this.agent.processTipPayment(tipRequest);
    }
    
    return null;
  }
}

// Based on https://github.com/coinbase/x402 protocol

export interface TipContext {
  conversationId: string;
  messageId: string;
  authorAddress: string;
  authorDisplayName: string;
  postUrl?: string;
  content: string;
}

export interface TipRequest {
  recipientAddress: string;
  amount: number; // in USD
  message?: string;
  context: TipContext;
}

export interface TipAgentResponse {
  success: boolean;
  miniAppUrl?: string;
  message?: string;
  error?: string;
}

export class X402TipAgent {
  private miniAppBaseUrl: string;
  private facilitatorUrl: string;

  constructor(miniAppBaseUrl: string, facilitatorUrl?: string) {
    this.miniAppBaseUrl = miniAppBaseUrl;
    this.facilitatorUrl = facilitatorUrl || 'https://facilitator.x402.org';
  }

  // Detect if conversation context suggests tipping opportunity
  detectTipContext(message: string, conversation: any): TipContext | null {
    const content = message.toLowerCase();
    
    // Tip-related keywords
    const tipKeywords = [
      'tip', 'donate', 'support', 'appreciate', 'thanks', 'amazing', 'great work',
      'love this', 'incredible', 'brilliant', 'genius', 'helpful', 'useful'
    ];
    
    // Check if message contains tip-related sentiment
    const hasTipSentiment = tipKeywords.some(keyword => content.includes(keyword));
    
    if (hasTipSentiment) {
      return {
        conversationId: conversation.id,
        messageId: conversation.lastMessageId,
        authorAddress: conversation.lastMessageAuthor,
        authorDisplayName: conversation.lastMessageAuthorName || 'Anonymous',
        content: message,
        postUrl: this.extractPostUrl(message)
      };
    }
    
    return null;
  }

  // Generate tip mini app URL with context
  generateTipMiniAppUrl(context: TipContext, amount?: number): string {
    const params = new URLSearchParams({
      recipient: context.authorAddress,
      context: context.conversationId,
      author: context.authorDisplayName,
      ...(amount && { amount: amount.toString() }),
      ...(context.postUrl && { postUrl: context.postUrl })
    });
    
    return `${this.miniAppBaseUrl}/tip?${params.toString()}`;
  }

  // Agent response for tip context detection
  async handleTipContext(context: TipContext): Promise<TipAgentResponse> {
    try {
      const miniAppUrl = this.generateTipMiniAppUrl(context);
      
      return {
        success: true,
        miniAppUrl,
        message: `💝 Want to tip @${context.authorDisplayName}? Tap to send a tip:\n\n${miniAppUrl}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tip link'
      };
    }
  }

  // Process tip payment using x402 protocol
  async processTipPayment(tipRequest: TipRequest): Promise<TipAgentResponse> {
    try {
      // Step 1: Create x402 payment request
      const paymentRequest = await this.createX402PaymentRequest(tipRequest);
      
      // Step 2: Send to facilitator for settlement
      const settlementResponse = await this.settlePayment(paymentRequest);
      
      if (settlementResponse.success) {
        return {
          success: true,
          message: `✅ Tip sent! $${tipRequest.amount} USDC to @${tipRequest.context.authorDisplayName}`
        };
      } else {
        return {
          success: false,
          error: settlementResponse.error || 'Payment settlement failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tip payment failed'
      };
    }
  }

  // Create x402 payment request
  private async createX402PaymentRequest(tipRequest: TipRequest) {
    return {
      x402Version: 1,
      scheme: 'exact',
      network: '8453', // Base mainnet
      payload: {
        to: tipRequest.recipientAddress,
        amount: this.convertToAtomicUnits(tipRequest.amount),
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        message: tipRequest.message || `Tip for @${tipRequest.context.authorDisplayName}`
      }
    };
  }

  // Settle payment through x402 facilitator
  private async settlePayment(paymentRequest: any) {
    const response = await fetch(`${this.facilitatorUrl}/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest)
    });

    return await response.json();
  }

  // Convert USD to atomic units (USDC has 6 decimals)
  private convertToAtomicUnits(amount: number): string {
    return (amount * 1000000).toString();
  }

  // Extract Farcaster post URL from message
  private extractPostUrl(message: string): string | undefined {
    const urlRegex = /https?:\/\/warpcast\.com\/[^\s]+/g;
    const match = message.match(urlRegex);
    return match ? match[0] : undefined;
  }

  // Generate agent conversation responses
  generateAgentResponses(context: TipContext): string[] {
    const responses = [
      `💝 @${context.authorDisplayName} shared something awesome! Want to show appreciation?`,
      `🎯 Perfect moment to tip @${context.authorDisplayName} for their contribution!`,
      `✨ @${context.authorDisplayName} deserves recognition! Send a tip to show support.`,
      `🚀 @${context.authorDisplayName} created value - tip them to show appreciation!`
    ];
    
    return responses;
  }
}

// Agent behavior patterns based on Base documentation
export class TipAgentBehavior {
  private agent: X402TipAgent;
  private conversationHistory: Map<string, any[]> = new Map();

  constructor(agent: X402TipAgent) {
    this.agent = agent;
  }

  // Main agent message handler
  async handleMessage(message: string, conversation: any): Promise<TipAgentResponse | null> {
    const conversationId = conversation.id;
    
    // Track conversation history
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, []);
    }
    
    const history = this.conversationHistory.get(conversationId)!;
    history.push({ message, timestamp: Date.now() });
    
    // Keep only last 10 messages
    if (history.length > 10) {
      history.shift();
    }

    // Detect tip context
    const tipContext = this.agent.detectTipContext(message, conversation);
    
    if (tipContext) {
      // Check if we've already suggested tipping recently
      const recentTipSuggestions = history.filter(
        h => h.timestamp > Date.now() - 300000 && h.type === 'tip_suggestion' // 5 minutes
      );
      
      if (recentTipSuggestions.length === 0) {
        return await this.agent.handleTipContext(tipContext);
      }
    }

    return null;
  }

  // Handle direct tip requests
  async handleDirectTipRequest(message: string, conversation: any): Promise<TipAgentResponse | null> {
    const content = message.toLowerCase();
    
    if (content.includes('tip') && (content.includes('@') || content.includes('send'))) {
      // Extract recipient and amount from message
      const amountMatch = content.match(/\$?(\d+\.?\d*)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1.0;
      
      // This would need more sophisticated parsing in a real implementation
      const tipRequest: TipRequest = {
        recipientAddress: conversation.lastMessageAuthor,
        amount,
        message: `Tip from conversation`,
        context: {
          conversationId: conversation.id,
          messageId: conversation.lastMessageId,
          authorAddress: conversation.lastMessageAuthor,
          authorDisplayName: conversation.lastMessageAuthorName || 'Anonymous',
          content: message
        }
      };
      
      return await this.agent.processTipPayment(tipRequest);
    }
    
    return null;
  }
}

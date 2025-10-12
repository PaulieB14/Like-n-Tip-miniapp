// Tip Agent - Shares tip mini app in conversations
// Based on Base Mini Apps & Agents documentation

export interface TipContext {
  conversationId: string;
  messageContent: string;
  senderAddress: string;
  participants: string[];
}

export interface TipMiniApp {
  url: string;
  description: string;
  context: string[];
}

export class TipAgent {
  private miniAppUrl = "https://like-n-tip-miniapp.vercel.app";
  
  // Tip contexts that trigger mini app sharing
  private tipContexts = [
    "tip", "tipping", "donate", "donation", "support", "appreciate",
    "amazing", "great work", "love this", "thanks", "thank you",
    "creator", "artist", "builder", "developer", "content"
  ];

  // Detect if conversation context suggests tipping opportunity
  detectTipContext(context: TipContext): boolean {
    const content = context.messageContent.toLowerCase();
    return this.tipContexts.some(keyword => content.includes(keyword));
  }

  // Share tip mini app with rich preview
  async shareTipMiniApp(context: TipContext, customMessage?: string): Promise<string> {
    const message = customMessage || this.generateTipMessage(context);
    return `${message}\n\n${this.miniAppUrl}`;
  }

  // Generate contextual tip messages
  private generateTipMessage(context: TipContext): string {
    const content = context.messageContent.toLowerCase();
    
    if (content.includes("amazing") || content.includes("love this")) {
      return "💝 Show your appreciation with a tip!";
    }
    
    if (content.includes("creator") || content.includes("artist")) {
      return "🎨 Support this creator with a tip!";
    }
    
    if (content.includes("thanks") || content.includes("thank you")) {
      return "🙏 Want to say thanks with a tip?";
    }
    
    if (content.includes("great work") || content.includes("awesome")) {
      return "⭐ Reward great work with a tip!";
    }
    
    return "💰 Ready to tip? Share your appreciation!";
  }

  // Handle tip completion notifications
  async handleTipCompletion(
    context: TipContext, 
    tipAmount: number, 
    recipient: string
  ): Promise<string> {
    return `🎉 Tip sent! $${tipAmount.toFixed(2)} USDC to ${recipient}`;
  }

  // Create quick actions for tip amounts
  createTipQuickActions(): any {
    return {
      id: "tip_amounts",
      description: "Choose tip amount:",
      actions: [
        { id: "tip_0.01", label: "$0.01", style: "secondary" },
        { id: "tip_0.05", label: "$0.05", style: "secondary" },
        { id: "tip_0.10", label: "$0.10", style: "primary" },
        { id: "tip_0.25", label: "$0.25", style: "secondary" },
        { id: "tip_0.50", label: "$0.50", style: "secondary" },
        { id: "tip_1.00", label: "$1.00", style: "secondary" }
      ]
    };
  }
}

// Example usage for XMTP agent integration
export async function handleMessage(message: any, conversation: any) {
  const tipAgent = new TipAgent();
  
  const context: TipContext = {
    conversationId: conversation.id,
    messageContent: message.content,
    senderAddress: message.senderAddress,
    participants: conversation.participants || []
  };

  // Detect if this is a tip-worthy moment
  if (tipAgent.detectTipContext(context)) {
    const tipMessage = await tipAgent.shareTipMiniApp(context);
    await conversation.send(tipMessage);
    
    // Add quick actions for easy tip amounts
    const quickActions = tipAgent.createTipQuickActions();
    await conversation.send("Quick tip amounts:", quickActions);
  }
}

// Example: Group tip coordination
export async function coordinateGroupTip(
  conversation: any, 
  targetUser: string, 
  reason: string
) {
  const tipAgent = new TipAgent();
  
  const message = `🎯 Let's show ${targetUser} some love for ${reason}!`;
  const tipMessage = await tipAgent.shareTipMiniApp({
    conversationId: conversation.id,
    messageContent: message,
    senderAddress: "agent",
    participants: conversation.participants
  }, message);
  
  await conversation.send(tipMessage);
}

// Based on Base Mini Apps & Agents documentation

export interface TipContext {
  conversationId: string;
  messageContent: string;
  senderAddress: string;
  participants: string[];
}

export interface TipMiniApp {
  url: string;
  description: string;
  context: string[];
}

export class TipAgent {
  private miniAppUrl = "https://like-n-tip-miniapp.vercel.app";
  
  // Tip contexts that trigger mini app sharing
  private tipContexts = [
    "tip", "tipping", "donate", "donation", "support", "appreciate",
    "amazing", "great work", "love this", "thanks", "thank you",
    "creator", "artist", "builder", "developer", "content"
  ];

  // Detect if conversation context suggests tipping opportunity
  detectTipContext(context: TipContext): boolean {
    const content = context.messageContent.toLowerCase();
    return this.tipContexts.some(keyword => content.includes(keyword));
  }

  // Share tip mini app with rich preview
  async shareTipMiniApp(context: TipContext, customMessage?: string): Promise<string> {
    const message = customMessage || this.generateTipMessage(context);
    return `${message}\n\n${this.miniAppUrl}`;
  }

  // Generate contextual tip messages
  private generateTipMessage(context: TipContext): string {
    const content = context.messageContent.toLowerCase();
    
    if (content.includes("amazing") || content.includes("love this")) {
      return "💝 Show your appreciation with a tip!";
    }
    
    if (content.includes("creator") || content.includes("artist")) {
      return "🎨 Support this creator with a tip!";
    }
    
    if (content.includes("thanks") || content.includes("thank you")) {
      return "🙏 Want to say thanks with a tip?";
    }
    
    if (content.includes("great work") || content.includes("awesome")) {
      return "⭐ Reward great work with a tip!";
    }
    
    return "💰 Ready to tip? Share your appreciation!";
  }

  // Handle tip completion notifications
  async handleTipCompletion(
    context: TipContext, 
    tipAmount: number, 
    recipient: string
  ): Promise<string> {
    return `🎉 Tip sent! $${tipAmount.toFixed(2)} USDC to ${recipient}`;
  }

  // Create quick actions for tip amounts
  createTipQuickActions(): any {
    return {
      id: "tip_amounts",
      description: "Choose tip amount:",
      actions: [
        { id: "tip_0.01", label: "$0.01", style: "secondary" },
        { id: "tip_0.05", label: "$0.05", style: "secondary" },
        { id: "tip_0.10", label: "$0.10", style: "primary" },
        { id: "tip_0.25", label: "$0.25", style: "secondary" },
        { id: "tip_0.50", label: "$0.50", style: "secondary" },
        { id: "tip_1.00", label: "$1.00", style: "secondary" }
      ]
    };
  }
}

// Example usage for XMTP agent integration
export async function handleMessage(message: any, conversation: any) {
  const tipAgent = new TipAgent();
  
  const context: TipContext = {
    conversationId: conversation.id,
    messageContent: message.content,
    senderAddress: message.senderAddress,
    participants: conversation.participants || []
  };

  // Detect if this is a tip-worthy moment
  if (tipAgent.detectTipContext(context)) {
    const tipMessage = await tipAgent.shareTipMiniApp(context);
    await conversation.send(tipMessage);
    
    // Add quick actions for easy tip amounts
    const quickActions = tipAgent.createTipQuickActions();
    await conversation.send("Quick tip amounts:", quickActions);
  }
}

// Example: Group tip coordination
export async function coordinateGroupTip(
  conversation: any, 
  targetUser: string, 
  reason: string
) {
  const tipAgent = new TipAgent();
  
  const message = `🎯 Let's show ${targetUser} some love for ${reason}!`;
  const tipMessage = await tipAgent.shareTipMiniApp({
    conversationId: conversation.id,
    messageContent: message,
    senderAddress: "agent",
    participants: conversation.participants
  }, message);
  
  await conversation.send(tipMessage);
}

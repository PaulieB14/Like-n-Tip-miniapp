// Base Mini App Configuration
// This follows the official Base mini app structure

const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'https://your-domain.vercel.app'

export const minikitConfig = {
  accountAssociation: { // This will be added in step 5
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "LIke n Tip", 
    subtitle: "Send tips with style!", 
    description: "A fun and catchy way to tip your favorite Base app users with emojis and personalized messages. Perfect for showing appreciation in group chats!",
    screenshotUrls: [
      `${ROOT_URL}/screenshot-tip-form.png`,
      `${ROOT_URL}/screenshot-history.png`,
      `${ROOT_URL}/screenshot-success.png`
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["tipping", "social", "fun", "base", "x402", "group-chat", "usdc"],
    heroImageUrl: `${ROOT_URL}/hero.png`, 
    tagline: "Tip with style!",
    ogTitle: "LIke n Tip - Catchy Tipping for Base App",
    ogDescription: "Send tips to your favorite Base app users with catchy messages and emojis! Perfect for group chats and social interactions.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const

// Core Value Proposition:
// "The one thing this app does really well: Makes tipping fun and social"
// 
// Why someone would use it every day:
// - Quick, one-tap tipping in group chats
// - Fun emoji reactions and catchy messages
// - No complex setup - just connect wallet and tip
// - Track tip history and see appreciation
//
// Why someone would share it:
// - Makes group chats more rewarding and fun
// - Easy way to show appreciation
// - Creates positive social interactions
// - Perfect for creator communities

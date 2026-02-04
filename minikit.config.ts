const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://like-n-tip-miniapp.vercel.app'

export const minikitConfig = {
  accountAssociation: {
    // Generate these by signing the manifest with your wallet
    // See: https://docs.farcaster.xyz/developers/mini-apps
    header: "",
    payload: "",
    signature: ""
  },
  frame: {
    version: "1",
    name: "Like n Tip",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#0052ff",
    webhookUrl: `${ROOT_URL}/api/webhook`,
  },
  miniapp: {
    version: "1",
    name: "Like n Tip",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#0052ff",
    subtitle: "Micropayments for creators",
    description: "Send instant USDC tips to creators on Farcaster and Base. Powered by the x402 protocol for seamless HTTP-native payments.",
    primaryCategory: "social",
    tags: ["social", "tipping", "x402", "usdc", "payments", "creators"],
    heroImageUrl: `${ROOT_URL}/og-image.png`,
    tagline: "Tip creators instantly with x402",
    ogTitle: "Like n Tip — x402 Micropayments",
    ogDescription: "Send instant USDC tips to creators on Farcaster and Base. Powered by the x402 protocol.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: false
  },
} as const

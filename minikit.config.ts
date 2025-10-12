const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://like-n-tip-miniapp.vercel.app'

export const minikitConfig = {
  accountAssociation: {
    // This will be added when you sign the manifest
    "header": "",
    "payload": "",
    "signature": ""
  },
  baseBuilder: {
    allowedAddresses: ["0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2"]
  },
  miniapp: {
    version: "1",
    name: "Like n Tip",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#0052ff",
    webhookUrl: `${ROOT_URL}/api/webhook`,
    subtitle: "Auto-tip when you like",
    description: "Seamlessly tip creators when you like their posts. Features Mini App Context, Quick Auth, and Base Account capabilities for the ultimate tipping experience.",
    screenshotUrls: [
      `${ROOT_URL}/screenshot1.png`,
      `${ROOT_URL}/screenshot2.png`,
      `${ROOT_URL}/screenshot3.png`
    ],
    primaryCategory: "social",
    tags: ["social", "tipping", "base", "miniapp", "crypto"],
    heroImageUrl: `${ROOT_URL}/og-image.png`,
    tagline: "Tip with every like",
    ogTitle: "Like n Tip - Ultimate Base Mini App",
    ogDescription: "Seamlessly tip when you like posts in Base app. Features Mini App Context, Quick Auth, and Base Account capabilities.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: false
  },
} as const

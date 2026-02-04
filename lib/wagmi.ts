import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { coinbaseWallet, injected } from 'wagmi/connectors'

// App metadata for Coinbase Wallet
const appName = 'Like n Tip'
const appLogoUrl = 'https://like-n-tip-miniapp.vercel.app/icon.png'

export const config = createConfig({
  chains: [base],
  connectors: [
    // Farcaster Mini App connector (for Farcaster/Warpcast)
    miniAppConnector(),
    // Coinbase Wallet connector (for Base app)
    coinbaseWallet({
      appName,
      appLogoUrl,
      preference: 'smartWalletOnly', // Use smart wallet for gasless UX
    }),
    // Injected connector for browser extension wallets
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  ssr: false,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

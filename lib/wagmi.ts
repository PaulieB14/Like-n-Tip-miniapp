import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    // Farcaster Mini App connector (primary for Farcaster)
    miniAppConnector(),
    // Coinbase Wallet connector (recommended by OnchainKit)
    coinbaseWallet({
      appName: 'Like n Tip',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: false, // Disable SSR to prevent hydration issues
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

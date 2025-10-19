import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia], // Using Base Sepolia for testing
  connectors: [
    // Farcaster Mini App connector (primary for Farcaster)
    miniAppConnector(),
    // Injected connector for browser wallets
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  ssr: false, // Disable SSR to prevent hydration issues
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { injected } from 'wagmi/connectors'

// Safely handle ethereum provider conflicts
const safeInjectedConnector = () => {
  try {
    return injected({
      target: 'metaMask',
      shimDisconnect: true,
    })
  } catch (error) {
    console.warn('Failed to create injected connector:', error)
    return null
  }
}

export const config = createConfig({
  chains: [base],
  connectors: [
    // Farcaster Mini App connector (primary for Farcaster)
    miniAppConnector(),
    // Injected connector for Base app and browser wallets (with error handling)
    ...(safeInjectedConnector() ? [safeInjectedConnector()] : []),
  ].filter(Boolean),
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

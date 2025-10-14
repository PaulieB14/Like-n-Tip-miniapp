import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

export const config = createConfig({
  chains: [base],
  connectors: [
    // Farcaster Mini App connector (primary for Farcaster and Base app)
    miniAppConnector(),
  ],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

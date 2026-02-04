'use client'

import { x402Client, wrapFetchWithPayment } from '@x402/fetch'
import { registerExactEvmScheme, wagmiToClientSigner } from '@x402/evm'
import type { WalletClient } from 'viem'

// Create and configure an x402 client for use with wagmi wallet
export function createX402PaymentFetch(walletClient: WalletClient) {
  // Create x402 client instance
  const client = new x402Client()

  // Convert wagmi wallet to x402 signer
  const signer = wagmiToClientSigner(walletClient)

  // Register the EVM exact payment scheme with the signer
  registerExactEvmScheme(client, { signer })

  // Return wrapped fetch that handles x402 payments automatically
  return wrapFetchWithPayment(fetch, client)
}

// Helper to make x402-enabled API calls
export async function x402Fetch(
  walletClient: WalletClient,
  url: string,
  options?: RequestInit
): Promise<Response> {
  const fetchWithPayment = createX402PaymentFetch(walletClient)
  return fetchWithPayment(url, options)
}

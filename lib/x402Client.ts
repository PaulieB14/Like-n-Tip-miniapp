'use client'

import { x402Client, wrapFetchWithPayment } from '@x402/fetch'
import { registerExactEvmScheme } from '@x402/evm/exact/client'
import type { ClientEvmSigner } from '@x402/evm'
import type { WalletClient, Account } from 'viem'

/**
 * Converts a wagmi/viem WalletClient to a ClientEvmSigner for x402Client
 */
function wagmiToClientSigner(walletClient: WalletClient): ClientEvmSigner {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account')
  }

  return {
    address: walletClient.account.address,
    signTypedData: async (message) => {
      const signature = await walletClient.signTypedData({
        account: walletClient.account as Account,
        domain: message.domain,
        types: message.types,
        primaryType: message.primaryType,
        message: message.message,
      })
      return signature
    },
  }
}

/**
 * Create an x402-enabled fetch function using a wagmi wallet client
 */
export function createX402PaymentFetch(walletClient: WalletClient) {
  const client = new x402Client()
  const signer = wagmiToClientSigner(walletClient)
  registerExactEvmScheme(client, { signer })
  return wrapFetchWithPayment(fetch, client)
}

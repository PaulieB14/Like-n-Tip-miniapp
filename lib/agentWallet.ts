// Agent Wallet for x402 Autonomous Payments
// This is the wallet that will send tips autonomously

import { createWalletClient, http, parseUnits } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

const USDC_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

export interface AgentWalletConfig {
  privateKey: string
  rpcUrl?: string
}

export class AgentWallet {
  private client: any
  private account: any
  private address: string

  constructor(config: AgentWalletConfig) {
    // Create account from private key
    this.account = privateKeyToAccount(config.privateKey as `0x${string}`)
    this.address = this.account.address

    // Create wallet client
    this.client = createWalletClient({
      account: this.account,
      chain: base,
      transport: http(config.rpcUrl || 'https://mainnet.base.org')
    })

    console.log('Agent wallet initialized:', this.address)
  }

  /**
   * Get the agent's wallet address
   */
  getAddress(): string {
    return this.address
  }

  /**
   * Check if agent has enough USDC for a tip
   */
  async hasEnoughUSDC(amount: number): Promise<boolean> {
    try {
      const balance = await this.client.readContract({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [this.address]
      })

      const requiredAmount = parseUnits(amount.toString(), 6) // USDC has 6 decimals
      return balance >= requiredAmount
    } catch (error) {
      console.error('Error checking USDC balance:', error)
      return false
    }
  }

  /**
   * Send USDC tip to recipient
   */
  async sendUSDC(recipient: string, amount: number): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      console.log(`Agent sending $${amount} USDC to ${recipient}`)

      // Check if we have enough USDC
      const hasEnough = await this.hasEnoughUSDC(amount)
      if (!hasEnough) {
        return {
          success: false,
          error: `Insufficient USDC balance. Agent needs at least $${amount} USDC`
        }
      }

      // Convert amount to USDC units (6 decimals)
      const amountInUnits = parseUnits(amount.toString(), 6)

      // Send USDC transfer
      const txHash = await this.client.writeContract({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountInUnits]
      })

      console.log('USDC transfer successful:', txHash)
      return {
        success: true,
        txHash: txHash
      }

    } catch (error: any) {
      console.error('Error sending USDC:', error)
      return {
        success: false,
        error: error.message || 'USDC transfer failed'
      }
    }
  }

  /**
   * Get agent's USDC balance
   */
  async getUSDCBalance(): Promise<number> {
    try {
      const balance = await this.client.readContract({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [this.address]
      })

      // Convert from USDC units to human readable
      return Number(balance) / 1e6
    } catch (error) {
      console.error('Error getting USDC balance:', error)
      return 0
    }
  }
}

// Create agent wallet instance
// In production, this private key should be stored securely (e.g., environment variable)
// For demo purposes, we'll use a placeholder
const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001'

export const agentWallet = new AgentWallet({
  privateKey: AGENT_PRIVATE_KEY,
  rpcUrl: process.env.BASE_RPC_URL
})

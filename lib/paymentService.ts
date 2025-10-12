import { parseUnits } from 'viem'
import { base } from 'wagmi/chains'

// USDC contract address on Base
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

// USDC ABI for transfer function
export const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
] as const

export interface TipResult {
  success: boolean
  txHash?: string
  error?: string
}

export interface TipParams {
  recipientAddress: string
  amount: number // Amount in USDC (e.g., 0.10 for $0.10)
  message?: string
}

export class PaymentService {
  private writeContract: any
  private address: string
  private chainId: number

  constructor(writeContract: any, address: string, chainId: number = base.id) {
    this.writeContract = writeContract
    this.address = address
    this.chainId = chainId
  }

  async sendTip({ recipientAddress, amount, message }: TipParams): Promise<TipResult> {
    try {
      console.log('Sending real tip:', { recipientAddress, amount, message })

      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = parseUnits(amount.toString(), 6)

      // Call the USDC transfer function
      const txHash = await this.writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, amountInWei],
        chainId: this.chainId,
      })

      console.log('Tip transaction sent:', txHash)

      return {
        success: true,
        txHash: txHash
      }

    } catch (error: any) {
      console.error('Tip transaction failed:', error)
      
      return {
        success: false,
        error: error.message || 'Transaction failed'
      }
    }
  }

  async checkBalance(): Promise<number> {
    try {
      // This would require a read contract call
      // For now, return a mock balance
      return 10.0 // Mock balance
    } catch (error) {
      console.error('Failed to check balance:', error)
      return 0
    }
  }

  async estimateGas(recipientAddress: string, amount: number): Promise<bigint> {
    try {
      const amountInWei = parseUnits(amount.toString(), 6)
      
      // This would require a gas estimation call
      // For now, return a reasonable estimate
      return BigInt(100000) // ~100k gas
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      return BigInt(100000)
    }
  }
}

// Helper function to create payment service
export function createPaymentService(writeContract: any, address: string, chainId?: number): PaymentService {
  return new PaymentService(writeContract, address, chainId)
}

// Helper function to format USDC amount
export function formatUSDCAmount(amount: number): string {
  return `$${amount.toFixed(2)} USDC`
}

// Helper function to validate tip amount
export function validateTipAmount(amount: number): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Tip amount must be greater than 0' }
  }
  
  if (amount > 1000) {
    return { valid: false, error: 'Tip amount cannot exceed $1000' }
  }
  
  if (amount < 0.01) {
    return { valid: false, error: 'Minimum tip amount is $0.01' }
  }
  
  return { valid: true }
}

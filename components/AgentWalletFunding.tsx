'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useConnect, useReadContract } from 'wagmi'
import { Wallet, DollarSign, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { parseUnits } from 'viem'
import { base } from 'wagmi/chains'

interface AgentWalletFundingProps {
  onFundingComplete?: () => void
}

interface AgentWalletInfo {
  address: string
  balance: number
  hasEnoughFunds: boolean
}

// USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default function AgentWalletFunding({ onFundingComplete }: AgentWalletFundingProps) {
  const { address: userAddress, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const { connect, connectors } = useConnect()
  
  const [agentInfo, setAgentInfo] = useState<AgentWalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAgentInfo, setIsLoadingAgentInfo] = useState(false)
  const [fundingAmount, setFundingAmount] = useState(1.0)
  const [isFunding, setIsFunding] = useState(false)
  const [fundingError, setFundingError] = useState<string | null>(null)
  const [fundingSuccess, setFundingSuccess] = useState<string | null>(null)

  // Check user's USDC balance
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: USDC_CONTRACT,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && isConnected,
    }
  })

  // Quick funding amounts (micropayments need small funding)
  const quickAmounts = [0.1, 0.5, 1.0, 2.0, 5.0]

  useEffect(() => {
    if (userAddress) {
      loadAgentInfo()
    }
  }, [userAddress])

  // Debug wallet connection status
  useEffect(() => {
    console.log('Wallet connection status:', { 
      isConnected, 
      userAddress, 
      connectors: connectors.length,
      connectorNames: connectors.map(c => c.name)
    })
    if (connectors.length === 0) {
      console.warn('No wallet connectors available - this may cause connection issues')
    }
  }, [isConnected, userAddress, connectors])

  const loadAgentInfo = async () => {
    // Skip agent wallet loading - using x402 + CDP gasless integration
    console.log('x402: Skipping agent wallet loading - using x402 + CDP gasless integration')
    
    setAgentInfo({
      address: 'Not needed - using x402 + CDP gasless integration',
      balance: 0,
      hasEnoughFunds: true // Always true since no funding needed
    })
    setIsLoading(false)
  }

  const handleFundWallet = async (amount: number) => {
    if (!isConnected || !userAddress) {
      setFundingError('Please connect your wallet first')
      return
    }

    if (!agentInfo?.address) {
      setFundingError('Agent wallet address not available')
      return
    }

    setIsFunding(true)
    setFundingError(null)
    setFundingSuccess(null)

    try {
      // Convert amount to USDC units (6 decimals)
      const amountInUnits = parseUnits(amount.toString(), 6)

      // Check if user has enough USDC balance
      const userBalanceInUnits = userBalance ? BigInt(userBalance.toString()) : BigInt(0)
      if (userBalanceInUnits < amountInUnits) {
        const userBalanceFormatted = Number(userBalanceInUnits) / 1e6
        setFundingError(`Insufficient USDC balance. You have $${userBalanceFormatted.toFixed(2)} USDC, but need $${amount.toFixed(2)} USDC to fund the agent wallet.`)
        return
      }

      console.log('Funding agent wallet:', {
        from: userAddress,
        to: agentInfo.address,
        amount: amount,
        amountInUnits: amountInUnits.toString(),
        userBalance: userBalanceInUnits.toString()
      })

      // Send USDC from user's wallet to agent wallet
      const txHash = await writeContract({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [agentInfo.address as `0x${string}`, amountInUnits],
        chain: base,
        account: userAddress,
      })

      console.log('Funding transaction submitted:', txHash)
      setFundingSuccess(`Transaction submitted! Hash: ${txHash}. Please wait for confirmation and refresh to see updated balance.`)
      
      // Don't update local balance immediately - wait for actual on-chain confirmation
      // Refresh both user and agent balances after a delay
      setTimeout(async () => {
        await refetchUserBalance()
        await loadAgentInfo()
      }, 3000)
      
      if (onFundingComplete) {
        onFundingComplete()
      }
    } catch (error: any) {
      console.error('Funding failed:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Funding transaction failed'
      if (error.message?.includes('transfer amount exceeds balance')) {
        errorMessage = 'Insufficient USDC balance in your wallet. Please ensure you have enough USDC to fund the agent wallet.'
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setFundingError(errorMessage)
    } finally {
      setIsFunding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-slate-600">Loading agent wallet...</span>
        </div>
      </div>
    )
  }

  if (!agentInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">Failed to load agent wallet info</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Wallet Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Agent Wallet</h3>
            <p className="text-sm text-slate-600">Funds tips autonomously</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Address:</span>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                {agentInfo.address}
              </code>
              <button className="text-blue-500 hover:text-blue-600">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">USDC Balance:</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-900">
                ${agentInfo.balance.toFixed(2)}
              </span>
              <button
                onClick={async () => {
                  setIsLoading(true)
                  await loadAgentInfo()
                  await refetchUserBalance()
                  setIsLoading(false)
                }}
                className="p-1 hover:bg-slate-100 rounded"
                title="Refresh balance"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {agentInfo.hasEnoughFunds ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status:</span>
            <span className={`text-sm font-medium ${
              agentInfo.hasEnoughFunds ? 'text-green-600' : 'text-amber-600'
            }`}>
              {agentInfo.hasEnoughFunds ? 'Ready to tip' : 'Needs funding'}
            </span>
          </div>

          {/* User's USDC Balance */}
          {isConnected && userAddress && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Your USDC Balance:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-900">
                  ${userBalance ? (Number(userBalance) / 1e6).toFixed(2) : '0.00'}
                </span>
                <button
                  onClick={() => refetchUserBalance()}
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Refresh balance"
                >
                  <RefreshCw className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {/* Force Refresh Button */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={async () => {
                console.log('Force refreshing agent wallet balance...')
                setIsLoading(true)
                await loadAgentInfo()
                await refetchUserBalance()
                setIsLoading(false)
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : '🔄 Refresh Agent Wallet Balance'}
            </button>
          </div>
        </div>
      </div>

      {/* Funding Interface */}
      {!agentInfo.hasEnoughFunds && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-5 w-5 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">Fund Agent Wallet</h3>
              <p className="text-sm text-amber-700">
                Add USDC to enable autonomous tipping
              </p>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-4">
            <p className="text-sm font-medium text-amber-800 mb-3">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleFundWallet(amount)}
                  disabled={isFunding}
                  className="p-3 bg-white border border-amber-200 rounded-xl font-medium text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  {isFunding ? 'Funding...' : `$${amount}`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="flex space-x-2">
            <input
              type="number"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(parseFloat(e.target.value) || 0)}
              placeholder="Custom amount"
              min="1"
              max="1000"
              className="flex-1 px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              disabled={isFunding}
            />
            <button
              onClick={() => handleFundWallet(fundingAmount)}
              disabled={isFunding || fundingAmount <= 0}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              Fund
            </button>
          </div>

          {!isConnected && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800 mb-3">
                <strong>Connect Wallet Required:</strong> Please connect your wallet to fund the agent.
              </p>
              {connectors.length > 0 ? (
                <div className="space-y-2">
                  {connectors.map((connector, index) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Connect {connector.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  Wallet connection not available in this environment
                </p>
              )}
            </div>
          )}

          {fundingError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {fundingError}
              </p>
            </div>
          )}

          {fundingSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800 mb-3">
                <strong>Success:</strong> {fundingSuccess}
              </p>
              <button
                onClick={async () => {
                  setIsLoading(true)
                  await loadAgentInfo()
                  await refetchUserBalance()
                  setIsLoading(false)
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Balance'}
              </button>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Send USDC from your wallet to the agent wallet. 
              The agent will use these funds for micropayments ($0.001-$0.005 per tip).
            </p>
        <p className="text-sm text-green-800 mt-2">
          <strong>✅ x402 + CDP Integration Active:</strong> Tips are sent using x402 payment protocol with CDP automatic disbursement. 
          96% goes to the recipient, 4% platform fee. Gasless transactions via CDP paymaster! No agent wallet funding needed.
        </p>
          </div>
        </div>
      )}

      {/* Success State - x402 + CDP Integration */}
      {agentInfo.hasEnoughFunds && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">x402 + CDP Gasless Integration Active!</h3>
              <p className="text-sm text-green-700">
                No agent wallet funding needed - using x402 payment protocol with CDP gasless disbursement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

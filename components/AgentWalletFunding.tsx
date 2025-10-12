'use client'

import { useState, useEffect } from 'react'
import { Wallet, DollarSign, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface AgentWalletFundingProps {
  onFundingComplete?: () => void
}

interface AgentWalletInfo {
  address: string
  balance: number
  hasEnoughFunds: boolean
}

export default function AgentWalletFunding({ onFundingComplete }: AgentWalletFundingProps) {
  const [agentInfo, setAgentInfo] = useState<AgentWalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fundingAmount, setFundingAmount] = useState(10)
  const [isFunding, setIsFunding] = useState(false)

  // Quick funding amounts
  const quickAmounts = [5, 10, 25, 50, 100]

  useEffect(() => {
    loadAgentInfo()
  }, [])

  const loadAgentInfo = async () => {
    try {
      setIsLoading(true)
      
      // Get agent wallet info from API
      const response = await fetch('/api/agent-wallet')
      if (response.ok) {
        const data = await response.json()
        setAgentInfo(data)
      } else {
        // Fallback if API not available
        setAgentInfo({
          address: '0x1234...5678',
          balance: 0,
          hasEnoughFunds: false
        })
      }
    } catch (error) {
      console.error('Error loading agent info:', error)
      setAgentInfo({
        address: '0x1234...5678',
        balance: 0,
        hasEnoughFunds: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFundWallet = async (amount: number) => {
    setIsFunding(true)
    try {
      // In a real implementation, this would:
      // 1. Open Base wallet
      // 2. Show USDC transfer to agent wallet
      // 3. Wait for transaction confirmation
      // 4. Update balance
      
      // For now, simulate the funding process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful funding
      if (agentInfo) {
        setAgentInfo({
          ...agentInfo,
          balance: agentInfo.balance + amount,
          hasEnoughFunds: (agentInfo.balance + amount) >= 5
        })
      }
      
      if (onFundingComplete) {
        onFundingComplete()
      }
    } catch (error) {
      console.error('Funding failed:', error)
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

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> You'll be prompted to send USDC from your Base wallet 
              to the agent wallet. The agent will then use these funds to send tips autonomously.
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {agentInfo.hasEnoughFunds && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Ready to Tip!</h3>
              <p className="text-sm text-green-700">
                Agent wallet has sufficient funds for autonomous tipping
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

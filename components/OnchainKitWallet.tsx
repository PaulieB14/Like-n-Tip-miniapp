'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Wallet, User, Copy, ExternalLink, LogOut } from 'lucide-react'

export default function SimpleWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })
  const [showDropdown, setShowDropdown] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Connect Wallet</h3>
            <p className="text-slate-600 mb-4">Connect your wallet to send tips to creators</p>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{formatAddress(address!)}</p>
              <p className="text-sm text-slate-600">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Wallet className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
            <div className="p-4 space-y-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Address</span>
              </button>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on BaseScan</span>
              </a>
              <button
                onClick={() => disconnect()}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

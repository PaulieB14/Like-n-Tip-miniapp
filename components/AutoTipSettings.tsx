'use client'

import { useState, useEffect } from 'react'
import { Settings, Heart, Zap, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react'

interface AutoTipSettingsProps {
  onSettingsChange: (settings: AutoTipSettings) => void
}

export interface AutoTipSettings {
  enabled: boolean
  defaultAmount: number
  quickAmounts: number[]
}

export default function AutoTipSettings({ onSettingsChange }: AutoTipSettingsProps) {
  const [settings, setSettings] = useState<AutoTipSettings>({
    enabled: false,
    defaultAmount: 0.10, // $0.10 default
    quickAmounts: [0.01, 0.05, 0.10, 0.25, 0.50, 1.00]
  })

  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('autoTipSettings')
    if (saved) {
      const parsedSettings = JSON.parse(saved)
      setSettings(parsedSettings)
      onSettingsChange(parsedSettings)
    }
  }, [onSettingsChange])

  const updateSettings = (newSettings: Partial<AutoTipSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('autoTipSettings', JSON.stringify(updated))
    onSettingsChange(updated)
  }

  const toggleEnabled = () => {
    updateSettings({ enabled: !settings.enabled })
  }

  const setDefaultAmount = (amount: number) => {
    updateSettings({ defaultAmount: amount })
  }

  const setQuickAmount = (index: number, amount: number) => {
    const newQuickAmounts = [...settings.quickAmounts]
    newQuickAmounts[index] = amount
    updateSettings({ quickAmounts: newQuickAmounts })
  }

  return (
    <>
      {/* Settings Toggle Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
      >
        <Settings className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Auto-Tip</span>
        {settings.enabled && (
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">ON</span>
          </div>
        )}
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Auto-Tip Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-Tip on Like</h4>
                  <p className="text-sm text-gray-600">Automatically send tips when you like posts</p>
                </div>
                <button
                  onClick={toggleEnabled}
                  className="flex items-center space-x-2"
                >
                  {settings.enabled ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {settings.enabled && (
              <>
                {/* Default Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Default Tip Amount (USDC)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={settings.defaultAmount}
                      onChange={(e) => setDefaultAmount(parseFloat(e.target.value) || 0)}
                      placeholder="0.10"
                      step="0.01"
                      min="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Quick Amount Presets */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Amount Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {settings.quickAmounts.map((amount, index) => (
                      <div key={index} className="relative">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setQuickAmount(index, parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0.01"
                          className="w-full pl-7 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-base-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                  <p className="text-sm text-blue-800">
                    When you like a post, you'll automatically send <strong>${settings.defaultAmount.toFixed(2)} USDC</strong> as a tip.
                  </p>
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-base-500 to-base-600 text-white font-bold py-3 px-4 rounded-lg hover:from-base-600 hover:to-base-700 transition-all duration-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

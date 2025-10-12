'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import UltimateBaseIntegration from '@/components/UltimateBaseIntegration'

export default function Home() {
  useEffect(() => {
    // Hide loading splash screen when app is ready
    const initializeApp = async () => {
      try {
        await sdk.actions.ready()
      } catch (error) {
        console.log('App ready signal sent')
      }
    }
    
    initializeApp()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-base-500 to-base-600 p-3 rounded-xl">
                <span className="text-2xl">💖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LIke n Tip</h1>
                <p className="text-sm text-gray-600">Ultimate Base Mini App Integration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-base-500 to-base-600 text-white rounded-full">
              <span className="text-sm font-medium">Base Mini App</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <UltimateBaseIntegration />
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with ❤️ for Base Mini Apps</p>
            <p className="mt-1">Leveraging Mini App Context, Quick Auth & Base Account capabilities</p>
          </div>
        </div>
      </div>
    </div>
  )
}

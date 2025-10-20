import UltimateBaseIntegration from '@/components/UltimateBaseIntegration'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen">
      <ErrorBoundary>
        <UltimateBaseIntegration />
      </ErrorBoundary>
    </main>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIke n Tip - Revolutionary Auto-Tip for Base App',
  description: 'Set your default tip amount and automatically send tips when you like posts in Base app. Revolutionary like-to-tip experience!',
  keywords: ['base app', 'tipping', 'auto-tip', 'like to tip', 'crypto', 'usdc', 'x402'],
  authors: [{ name: 'Paul Barba' }],
  creator: 'Paul Barba',
  publisher: 'LIke n Tip',
  openGraph: {
    title: 'LIke n Tip - Revolutionary Auto-Tip for Base App',
    description: 'Set your default tip amount and automatically send tips when you like posts in Base app. Revolutionary like-to-tip experience!',
    url: 'https://like-n-tip-miniapp.vercel.app',
    siteName: 'LIke n Tip',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LIke n Tip - Revolutionary Auto-Tip for Base App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIke n Tip - Revolutionary Auto-Tip for Base App',
    description: 'Set your default tip amount and automatically send tips when you like posts in Base app.',
    images: ['/og-image.png'],
    creator: '@paulieb14',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0284c7' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content='{
          "version":"next",
          "imageUrl":"/og-image.png",
          "button":{
            "title":"🚀 Auto-Tip Now!",
            "action":{
              "type":"launch_miniapp",
              "name":"LIke n Tip",
              "url":"https://like-n-tip-miniapp.vercel.app"
            }
          }
        }' />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gradient-to-br from-base-50 via-white to-base-100 min-h-screen font-inter">
        <div className="fixed inset-0 bg-gradient-to-br from-base-500/5 via-transparent to-base-600/5 pointer-events-none" />
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LIke n Tip - Ultimate Base Mini App',
  description: 'Seamlessly tip when you like posts in Base app. Features Mini App Context, Quick Auth, and Base Account capabilities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: 'next',
            imageUrl: 'https://like-n-tip-miniapp.vercel.app/og-image.svg',
            button: {
              title: 'Open LIke n Tip',
              action: {
                type: 'launch_frame',
                url: 'https://like-n-tip-miniapp.vercel.app',
                name: 'LIke n Tip',
                splashImageUrl: 'https://like-n-tip-miniapp.vercel.app/splash.svg',
                splashBackgroundColor: '#0052ff'
              }
            }
          })}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

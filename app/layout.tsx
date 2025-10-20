import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './console-suppress'
import Providers from '@/components/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Like n Tip - Ultimate Base Mini App',
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
            imageUrl: 'https://like-n-tip-miniapp.vercel.app/og-image.png',
            button: {
              title: 'Open Like n Tip',
              action: {
                type: 'launch_frame',
                url: 'https://like-n-tip-miniapp.vercel.app',
                name: 'Like n Tip',
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
// Force deployment Sat Oct 11 20:34:14 EDT 2025
// Force fresh deployment 1760229550

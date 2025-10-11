import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIke n Tip - Catchy Tipping for Base App',
  description: 'Send tips to your favorite Base app users with catchy messages and emojis! Perfect for group chats and social interactions.',
  openGraph: {
    title: 'LIke n Tip - Catchy Tipping for Base App',
    description: 'Send tips to your favorite Base app users with catchy messages and emojis!',
    images: ['/og-image.png'],
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
            "title":"Send a Tip!",
            "action":{
              "type":"launch_miniapp",
              "name":"LIke n Tip",
              "url":"https://your-domain.vercel.app"
            }
          }
        }' />
      </head>
      <body className="bg-gradient-to-br from-base-50 to-base-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}

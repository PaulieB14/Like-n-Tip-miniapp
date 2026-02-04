<p align="center">
  <img src="public/icon.png" alt="Like n Tip" width="120" height="120" />
</p>

<h1 align="center">Like n Tip</h1>

<p align="center">
  <strong>Micropayments for the Creator Economy</strong>
</p>

<p align="center">
  Send instant USDC tips to creators on Farcaster and Base — powered by the x402 protocol.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Features

- **Instant Micropayments** — Send tips as small as $0.001 USDC
- **Cross-Platform** — Works on Farcaster (Warpcast) and Base app (Coinbase Wallet)
- **x402 Protocol** — HTTP-native payments with automatic settlement
- **No Gas Hassle** — Facilitator handles on-chain settlement
- **Simple UX** — Paste a post URL, pick an amount, sign once

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   MiniApp   │────▶│  x402 API   │────▶│ Facilitator │
│  (Wallet)   │     │  (Next.js)  │     │  (withX402) │     │  (Coinbase) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │                    │
      │  1. Connect        │                    │                    │
      │─────────────────▶  │                    │                    │
      │                    │  2. POST /api/tip  │                    │
      │                    │───────────────────▶│                    │
      │                    │     402 Payment    │                    │
      │                    │◀───────────────────│                    │
      │  3. Sign Payment   │                    │                    │
      │◀───────────────────│                    │                    │
      │─────────────────▶  │                    │                    │
      │                    │  4. Retry w/ sig   │                    │
      │                    │───────────────────▶│                    │
      │                    │                    │  5. Verify & Settle│
      │                    │                    │───────────────────▶│
      │                    │     200 OK         │                    │
      │                    │◀───────────────────│◀───────────────────│
      │  6. Success!       │                    │                    │
      │◀───────────────────│                    │                    │
```

1. User connects wallet (Coinbase Wallet or Farcaster)
2. User pastes a post URL and selects tip amount
3. App requests payment via x402 protocol
4. User signs the payment with their wallet
5. Facilitator verifies signature and settles USDC on-chain
6. Creator receives USDC instantly

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/PaulieB14/Like-n-Tip-miniapp.git
cd Like-n-Tip-miniapp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Configuration

Edit `.env` with your values:

```env
# x402 facilitator (Coinbase hosted)
FACILITATOR_URL=https://x402.org/facilitator

# Your wallet address to receive tips
TIP_RECIPIENT_ADDRESS=0xYourWalletAddress

# App URL (for minikit manifest)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# OnchainKit API key (get from portal.cdp.coinbase.com)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PaulieB14/Like-n-Tip-miniapp)

1. Click the button above
2. Add environment variables in Vercel dashboard
3. Deploy

### Manual

```bash
npm run build
npm start
```

## Publishing as a MiniApp

### Farcaster

1. Generate account association in `minikit.config.ts`
2. Sign the manifest with your wallet
3. Submit to Farcaster miniapp directory

### Base App (Coinbase Wallet)

The app automatically works in Coinbase Wallet when using MiniKit. No additional configuration needed.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) |
| Payments | [x402 Protocol](https://x402.org/) |
| Wallet | [wagmi](https://wagmi.sh/) + [OnchainKit](https://onchainkit.xyz/) |
| Network | [Base](https://base.org/) (Mainnet) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |

### x402 Packages

- `@x402/next` — Server-side payment protection with `withX402()`
- `@x402/fetch` — Client-side payment wrapper
- `@x402/evm` — EVM chain support (Base, Ethereum)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── tip/                      # x402-protected tip endpoint
│   │   └── resolve-farcaster-address/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SimpleTipApp.tsx              # Main tipping interface
│   ├── OnchainKitWallet.tsx          # Wallet connection UI
│   ├── WagmiProvider.tsx             # Providers setup
│   └── ...
├── lib/
│   ├── wagmi.ts                      # Wallet config
│   └── x402Client.ts                 # x402 client setup
└── minikit.config.ts                 # MiniApp manifest
```

## API Reference

### `POST /api/tip`

Send a tip to a creator. Protected by x402 — requires signed payment.

**Request:**
```json
{
  "amount": 0.01,
  "recipient": "0x...",
  "recipientUsername": "alice",
  "postUrl": "https://warpcast.com/alice/0x123"
}
```

**Response:**
```json
{
  "success": true,
  "amount": 0.01,
  "recipient": "0x...",
  "message": "Tip of $0.01 sent to @alice",
  "protocol": "x402"
}
```

## Resources

- [x402 Protocol Documentation](https://docs.cdp.coinbase.com/x402/welcome)
- [x402 GitHub](https://github.com/coinbase/x402)
- [OnchainKit Docs](https://onchainkit.xyz/getting-started)
- [Farcaster MiniApps](https://docs.farcaster.xyz/developers/mini-apps)

## License

MIT

---

<p align="center">
  Built with x402 on Base
</p>

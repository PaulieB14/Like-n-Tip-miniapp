# LIke n Tip - Base Mini App

A catchy tipping mini app for Base app that enables users to send tips with fun messages and emojis using the x402 payment protocol.

## 🚀 Features

- **Instant Tipping**: Send tips to Base app users instantly
- **Catchy Messages**: Pre-built fun messages and emoji picker
- **x402 Integration**: Seamless payments using Coinbase's x402 protocol
- **Base Mini App**: Native integration with Base app ecosystem
- **USDC on Base**: Fee-free payments using USDC on Base network
- **Tip History**: Track sent and received tips
- **Group Chat Focus**: Perfect for Base app group chats
- **Platform Fee**: 2% platform fee (transparent and fair)

## 🎯 Core Value Proposition

**The one thing this app does really well: Makes tipping fun and social**

- **Why someone would use it every day**: Quick, one-tap tipping in group chats with fun emoji reactions
- **Why someone would share it**: Makes group chats more rewarding and creates positive social interactions
- **Perfect for**: Creator communities, gaming groups, and social circles

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: x402 protocol with Coinbase facilitator
- **Blockchain**: Base network, USDC
- **Mini App**: Base Mini App structure
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Base app account
- MetaMask or compatible wallet
- USDC on Base network for testing

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd like-n-tip
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💰 x402 Payment Flow

This app implements the x402 payment protocol for seamless tipping:

1. **Payment Request**: User initiates a tip
2. **402 Response**: Server responds with payment requirements
3. **Payment Header**: Client creates x402 payment payload
4. **Verification**: Server verifies payment via Coinbase facilitator
5. **Settlement**: Payment is settled on Base network
6. **Success**: Tip is processed and user receives confirmation

## 🏗 Base Mini App Setup

To deploy as a Base mini app:

1. **Update Manifest**: Edit `app/.well-known/farcaster.json` with your domain
2. **Account Association**: Generate credentials via Base Build
3. **Deploy**: Push to Vercel or your hosting platform
4. **Preview**: Use Base Build preview tool
5. **Publish**: Post your app URL in Base app

## 🔧 Environment Variables

```bash
# Base Account Address (where tips will be sent)
TIP_RECIPIENT_ADDRESS=0x...

# x402 Facilitator URL
X402_FACILITATOR_URL=https://facilitator.x402.org

# USDC Contract Address on Base
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Base Network RPC URL
BASE_RPC_URL=https://mainnet.base.org

# Next.js Configuration
NEXT_PUBLIC_ROOT_URL=https://your-domain.vercel.app
```

## 📁 Project Structure

```
like-n-tip/
├── app/
│   ├── .well-known/
│   │   └── farcaster.json          # Base mini app manifest
│   ├── api/
│   │   └── tip/
│   │       └── route.ts            # x402 payment endpoint
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main app page
├── components/
│   ├── TipForm.tsx                 # Main tipping form
│   └── TipHistory.tsx              # Tip history display
├── minikit.config.ts               # Base mini app configuration
├── package.json                    # Dependencies
├── next.config.js                  # Next.js configuration
└── tailwind.config.js              # Tailwind configuration
```

## 💡 Base App Guidelines

This app follows Base app best practices:

- **Simple & Focused**: One core function - catchy tipping
- **Low Friction**: No complex setup, just connect wallet and tip
- **Group Chat Focus**: Perfect for social interactions
- **Onchain Native**: Built for Base's crypto-native users
- **Fun & Engaging**: Emojis and catchy messages make it social

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Configure Base Mini App

1. Update `minikit.config.ts` with your domain
2. Generate account association credentials via Base Build
3. Update manifest with credentials
4. Test with Base Build preview tool
5. Post your app URL in Base app to publish

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps/)
- [x402 Protocol Documentation](https://docs.cdp.coinbase.com/x402/welcome)
- [x402 GitHub Repository](https://github.com/coinbase/x402)
- [Base Network Documentation](https://docs.base.org/)

## 💬 Support

For support, join the Base Discord community or open an issue on GitHub.

---

Built with ❤️ for the Base app community

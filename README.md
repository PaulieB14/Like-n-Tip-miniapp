# Simple Tip App

A professional mini app for Farcaster and Base that enables micropayments for social media posts. Fund an agent wallet once, then send autonomous tips to any post using the x402 payment protocol.

## 🚀 Features

- **Universal Post Support**: Works with Farcaster and Base app post URLs
- **Agent Wallet System**: Fund once, tip autonomously forever
- **Micropayments**: Send tips as small as $0.001 USDC
- **x402 Protocol**: Uses Coinbase's x402 for autonomous payments
- **Cross-Platform**: Works on both Farcaster and Base app
- **Real USDC**: Actual transactions on Base network

## 🎯 How It Works

### 1. **Fund Your Agent Wallet**
- Connect your Base wallet
- Send USDC to your personal agent wallet
- Agent wallet handles all future tips autonomously

### 2. **Paste Any Post URL**
- Copy any Farcaster or Base app post URL
- App loads the post and author information
- Ready to send tips

### 3. **Send Micropayments**
- Choose from preset amounts ($0.001 - $0.05)
- Agent wallet automatically sends USDC to the author
- No additional wallet confirmations needed

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: x402 protocol, USDC on Base
- **Wallet**: Wagmi with Farcaster Mini App connector
- **Blockchain**: Base network
- **Protocol**: Coinbase x402 for autonomous payments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Base wallet with USDC
- Farcaster or Base app account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PaulieB14/Like-n-Tip-miniapp.git
cd Like-n-Tip-miniapp
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

## 🔧 Environment Variables

```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# App URLs
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_ROOT_URL=https://your-domain.vercel.app

# USDC Contract Address on Base
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## 📁 Project Structure

```
like-n-tip/
├── app/
│   ├── api/
│   │   ├── tip/                    # x402 payment endpoint
│   │   ├── agent-wallet/           # Agent wallet management
│   │   └── user-agent-wallet/      # User-specific agent info
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main app page
├── components/
│   ├── UltimateBaseIntegration.tsx # Main app wrapper
│   ├── SimpleTipApp.tsx           # Core tipping interface
│   ├── AgentWalletFunding.tsx     # Agent wallet funding
│   └── WagmiProvider.tsx          # Wallet provider
├── lib/
│   ├── agentWallet.ts             # Agent wallet management
│   ├── fundingService.ts          # Wallet funding service
│   ├── simpleTipService.ts        # x402 tip service
│   └── wagmi.ts                   # Wallet configuration
├── minikit.config.ts              # Mini app configuration
└── package.json                   # Dependencies
```

## 🏗 Mini App Setup

### For Farcaster

1. Update `minikit.config.ts` with your domain
2. Deploy to Vercel or your hosting platform
3. Test with Farcaster's mini app preview
4. Share your app URL in Farcaster

### For Base App

1. Update `minikit.config.ts` with your domain
2. Generate credentials via Base Build
3. Deploy to Vercel
4. Test with Base Build preview tool
5. Post your app URL in Base app

## 💡 Supported URLs

The app works with these URL formats:

### Farcaster
- `https://warpcast.com/username/post-id`
- `https://farcaster.xyz/username/post-id`

### Base App
- `https://base.org/username/post-id`
- `https://base.xyz/username/post-id`

### Generic Social Platforms
- Any URL with username/post-id structure

## 🔧 x402 Protocol

This app implements the x402 payment protocol for autonomous micropayments:

1. **Initial Request**: App requests tip with payment details
2. **402 Response**: Server responds with payment requirements
3. **Payment Creation**: Agent wallet creates payment payload
4. **Autonomous Payment**: Agent sends USDC without user interaction

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Configure Mini App

1. Update `minikit.config.ts` with your domain
2. Test with platform preview tools
3. Share your app URL to publish

## 🎯 Use Cases

### **For Users:**
- Support creators with micropayments
- Fund once, tip forever
- Seamless tipping experience

### **For Creators:**
- Receive tips from engaged users
- Build sustainable creator economy
- Focus on content creation

### **For Platforms:**
- Enable value flow between users
- Build stronger creator economy
- Increase engagement and retention

## 🔧 Features

- ✅ **Agent Wallet System**: Fund once, tip autonomously
- ✅ **Micropayments**: Tips as small as $0.001
- ✅ **x402 Protocol**: Autonomous payment system
- ✅ **Cross-Platform**: Works on Farcaster and Base
- ✅ **Real USDC**: Actual transactions on Base network
- ✅ **Mobile Optimized**: Perfect for mobile experience
- ✅ **Wallet Integration**: Seamless wallet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/)
- [Base Mini Apps Guide](https://miniapps.farcaster.xyz/)
- [x402 Protocol Documentation](https://docs.base.org/base-app/agents/x402-agents)
- [Base Network Documentation](https://docs.base.org/)
- [Wagmi Documentation](https://wagmi.sh/)

## 💬 Support

For support, join the Farcaster or Base Discord community or open an issue on GitHub.

---

Built with ❤️ for the creator economy

**Simple tipping that makes every interaction valuable!** 🚀
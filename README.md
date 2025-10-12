# LIke n Tip - Base App Auto-Tip Integration

A revolutionary Base mini app that automatically sends tips when you like posts in Base app. Set your default tip amount once, then every time you like a post, a tip is automatically sent to the author!

## 🚀 Revolutionary Features

- **Auto-Tip on Like**: Set your default tip amount and automatically tip when you like posts
- **Seamless Integration**: Works directly with Base app's existing like system
- **No Extra Steps**: Just like posts normally - tips are sent automatically
- **x402 Protocol**: Powered by Coinbase's x402 for instant, fee-free payments
- **USDC on Base**: All tips sent in USDC on Base network
- **Super Low Friction**: Set amount once, tip forever
- **Platform Commission**: 2% platform fee (transparent and fair)

## 🎯 Core Value Proposition

**The one thing this app does really well: Makes tipping automatic and effortless**

- **Why someone would use it every day**: Set your tip amount once, then every like automatically rewards creators
- **Why someone would share it**: Creates a culture of automatic appreciation in Base app
- **Perfect for**: Creator communities, social interactions, and building a tipping culture

## 🛠 How It Works

### **1. Set Your Default Tip Amount**
- Choose from preset amounts: $0.01, $0.05, $0.10, $0.25, $0.50, $1.00
- Or set a custom amount
- Enable/disable auto-tipping anytime

### **2. Like Posts in Base App**
- Use Base app normally
- Like posts as you always do
- No extra steps or UI changes

### **3. Auto-Tip Sent**
- Your preset tip amount is automatically sent
- Uses x402 protocol for instant payments
- Author receives tip with "Liked your post! 💖" message

## 🏗 Base App Integration

This mini app integrates directly with Base app's like system:

```typescript
// Base app integration example
window.baseAppAutoTipHandler = (postId, authorAddress, authorUsername) => {
  if (autoTipEnabled && defaultAmount > 0) {
    sendTip(authorAddress, defaultAmount, "Liked your post! 💖")
  }
}
```

### **Integration Points:**
- **Like Detection**: Hooks into Base app's like system
- **Auto-Tip Trigger**: Automatically sends tips when likes are detected
- **x402 Payments**: Uses Coinbase's facilitator for seamless payments
- **USDC on Base**: All transactions on Base network

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: x402 protocol with Coinbase facilitator
- **Blockchain**: Base network, USDC
- **Mini App**: Base Mini App structure
- **Integration**: Base app like system hooks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Base app account
- MetaMask or compatible wallet
- USDC on Base network for tipping

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

## 💰 Auto-Tip Flow

1. **User sets default tip amount** (e.g., $0.10)
2. **User likes a post in Base app**
3. **Auto-tip handler detects the like**
4. **Tip is automatically sent via x402**
5. **Author receives tip instantly**

## 🏗 Base Mini App Setup

To deploy as a Base mini app:

1. **Update Manifest**: Edit `app/.well-known/farcaster.json` with your domain
2. **Account Association**: Generate credentials via Base Build
3. **Deploy**: Push to Vercel or your hosting platform
4. **Preview**: Use Base Build preview tool
5. **Publish**: Post your app URL in Base app

## 🔧 Environment Variables

```bash
# Platform Fee Recipient (your commission address)
PLATFORM_FEE_RECIPIENT=0xCfd58ff6B92C856b03F4143e38Bc5835cB70b4D2

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
│   ├── BaseAppIntegration.tsx      # Main auto-tip integration
│   ├── AutoTipSettings.tsx         # Settings component
│   ├── StreamlinedLikeButton.tsx   # Like button component
│   ├── TipForm.tsx                 # Traditional tip form
│   └── TipHistory.tsx              # Tip history display
├── minikit.config.ts               # Base mini app configuration
├── package.json                    # Dependencies
├── next.config.js                  # Next.js configuration
└── tailwind.config.js              # Tailwind configuration
```

## 💡 Base App Guidelines

This app follows Base app best practices:

- **Simple & Focused**: One core function - automatic tipping on likes
- **Zero Friction**: Set once, tip forever
- **Seamless Integration**: Works with existing Base app UI
- **Onchain Native**: Built for Base's crypto-native users
- **Creator Economy**: Automatically rewards content creators

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

## 🎯 Use Cases

### **For Users:**
- Set a small default tip (e.g., $0.10) and automatically reward creators
- Build a culture of appreciation in Base app
- Support creators without thinking about it

### **For Creators:**
- Get automatically rewarded when people like your posts
- Build sustainable creator economy
- Focus on content, not monetization

### **For Base App:**
- Creates automatic value flow
- Builds stronger creator economy
- Increases engagement and retention

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

**Revolutionary auto-tipping that makes every like count!** 🚀

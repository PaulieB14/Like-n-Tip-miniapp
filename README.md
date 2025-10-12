# Tip in Comments - Universal Comment Tipping Mini App

A revolutionary Base mini app that lets you tip creators by including tip amounts in your comments. Simply write comments with tip amounts like "$0.10 tip" or "💖 $0.25" and the system automatically sends real USDC to the author!

## 🚀 Revolutionary Features

- **Tip in Comments**: Include tip amounts directly in your comments
- **Universal Compatibility**: Works with any Farcaster post URL
- **Real USDC Transactions**: Sends actual USDC on Base network
- **Smart Parsing**: Detects multiple tip formats automatically
- **Clean Comments**: Tip parts are removed from visible comments
- **Mobile Optimized**: Perfect for mobile-first Base app experience
- **Zero Friction**: Just comment normally with tip amounts

## 🎯 Core Value Proposition

**The one thing this app does really well: Makes tipping as easy as commenting**

- **Why someone would use it every day**: Tip creators naturally while engaging with their content
- **Why someone would share it**: Creates a culture of appreciation through comments
- **Perfect for**: Creator communities, social interactions, and building a tipping culture

## 🛠 How It Works

### **1. Paste Any Post URL**
- Copy any Farcaster post URL
- Paste it into the app to load the post and author info
- Works with any post from any user

### **2. Write Comment with Tip**
- Write your comment normally
- Include tip amounts in various formats:
  - `"Great post! $0.10 tip"`
  - `"Amazing work! 💖 $0.25"`
  - `"Here's 0.50 USDC for this"`
  - `"Love this! +$1.00"`

### **3. Auto-Send Tip**
- System detects tip amounts automatically
- Sends real USDC to the author
- Posts clean comment without tip parts
- Author receives tip instantly

## 💡 Supported Tip Formats

The app intelligently detects tips in multiple formats:

### **Dollar Amounts**
- `"Great post! $0.10 tip"`
- `"tip $0.25"`
- `"+$0.50"`

### **USDC Amounts**
- `"0.10 USDC"`
- `"0.25 USDC tip"`
- `"tip 0.50 USDC"`

### **Cents**
- `"10 cents"`
- `"25 cents tip"`
- `"tip 50 cents"`

### **With Emojis**
- `"💖 $0.10"`
- `"💰 0.25"`
- `"💸 tip $0.50"`

### **Natural Language**
- `"Here's 0.10 USDC for this"`
- `"Sending 25 cents your way"`
- `"Love this! +$1.00"`

## 🏗 Base App Integration

This mini app integrates seamlessly with Base app:

```typescript
// Comment tip parsing example
const parseCommentForTip = (comment: string) => {
  // Detects tip patterns like "$0.10 tip", "💖 $0.25", etc.
  // Returns parsed tip amount and cleaned comment
}

// Real USDC payment
const sendTip = async (recipientAddress: string, amount: number) => {
  // Sends real USDC via Base network
  // Uses wagmi for wallet integration
}
```

### **Integration Points:**
- **Post URL Parsing**: Loads any Farcaster post
- **Comment Processing**: Real-time tip detection
- **USDC Payments**: Real transactions on Base network
- **Wallet Integration**: Uses Base app's wallet system

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Real USDC transactions via wagmi
- **Blockchain**: Base network, USDC contract
- **Mini App**: Base Mini App structure
- **Parsing**: Smart regex patterns for tip detection

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

## 💰 Comment Tipping Flow

1. **User pastes any Farcaster post URL**
2. **User writes comment with tip amount** (e.g., "Great post! $0.10 tip")
3. **System detects tip automatically**
4. **Real USDC is sent to author**
5. **Clean comment is posted** (without tip part)

## 🏗 Base Mini App Setup

To deploy as a Base mini app:

1. **Update Manifest**: Edit `minikit.config.ts` with your domain
2. **Account Association**: Generate credentials via Base Build
3. **Deploy**: Push to Vercel or your hosting platform
4. **Preview**: Use Base Build preview tool
5. **Publish**: Post your app URL in Base app

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
│   │   └── webhook/
│   │       └── route.ts            # Base app webhook handler
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout with Base app meta
│   └── page.tsx                    # Main app page
├── components/
│   ├── UltimateBaseIntegration.tsx # Main app component
│   ├── UniversalCommentTip.tsx     # Universal comment tipping
│   ├── CommentWithTip.tsx          # Comment input with tip parsing
│   ├── PostTipButton.tsx           # Direct tip buttons
│   └── CommentTipDemo.tsx          # Demo page
├── lib/
│   ├── commentTipParser.ts         # Tip parsing logic
│   ├── paymentService.ts           # USDC payment service
│   └── wagmi.ts                    # Wallet configuration
├── minikit.config.ts               # Base mini app configuration
├── package.json                    # Dependencies
└── tailwind.config.js              # Tailwind configuration
```

## 💡 Base App Guidelines

This app follows Base app best practices:

- **Simple & Focused**: One core function - tip in comments
- **Mobile First**: Optimized for mobile Base app experience
- **Real Transactions**: Actual USDC payments, not mock
- **Universal**: Works with any Farcaster post
- **Creator Economy**: Rewards content creators naturally

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
- Tip creators naturally while commenting
- Support creators without extra steps
- Build appreciation culture in Base app

### **For Creators:**
- Get rewarded through normal engagement
- Build sustainable creator economy
- Focus on content, not monetization

### **For Base App:**
- Creates natural value flow
- Builds stronger creator economy
- Increases engagement and retention

## 🔧 Features

- ✅ **Universal Post Support**: Works with any Farcaster post URL
- ✅ **Smart Tip Detection**: Multiple tip formats supported
- ✅ **Real USDC Payments**: Actual transactions on Base network
- ✅ **Clean Comments**: Tip parts removed from visible comments
- ✅ **Mobile Optimized**: Perfect for Base app mobile experience
- ✅ **Wallet Integration**: Uses Base app's wallet system
- ✅ **Error Handling**: Clear feedback for users
- ✅ **Settings Toggle**: Users can enable/disable the feature

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Base Mini Apps Documentation](https://miniapps.farcaster.xyz/)
- [Farcaster Mini Apps Guide](https://miniapps.farcaster.xyz/)
- [Base Network Documentation](https://docs.base.org/)
- [Wagmi Documentation](https://wagmi.sh/)

## 💬 Support

For support, join the Base Discord community or open an issue on GitHub.

---

Built with ❤️ for the Base app community

**Revolutionary comment tipping that makes every comment count!** 🚀
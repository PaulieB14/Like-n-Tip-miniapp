// Simple x402 middleware implementation
// Based on the actual x402 repository examples

export function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Only protect the tip endpoint
  if (url.pathname === '/api/tip') {
    console.log('🔍 MIDDLEWARE: Checking /api/tip request');
    console.log('🔍 MIDDLEWARE: Request method:', request.method);
    console.log('🔍 MIDDLEWARE: Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Log all headers to see what's being sent
    const allHeaders = Object.fromEntries(request.headers.entries());
    console.log('🔍 MIDDLEWARE: All headers:', JSON.stringify(allHeaders, null, 2));
    
    // Check for payment header with case sensitivity
    const paymentHeader = request.headers.get('X-PAYMENT');
    const paymentHeaderLower = request.headers.get('x-payment');
    console.log('🔍 MIDDLEWARE: X-PAYMENT header present:', !!paymentHeader);
    console.log('🔍 MIDDLEWARE: x-payment header present:', !!paymentHeaderLower);
    console.log('🔍 MIDDLEWARE: Payment header value:', paymentHeader ? paymentHeader.substring(0, 50) + '...' : 'null');
    
    if (!paymentHeader) {
      console.log('🔍 MIDDLEWARE: No payment header - returning 402');
      // Return 402 Payment Required with x402 response
      return new Response(
        JSON.stringify({
          x402Version: 1,
          maxAmountRequired: "0.10", // Max amount in USDC (e.g., $0.10)
          resource: "/api/tip",
          description: "Send tip to content creator",
          payTo: "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436", // Default recipient address
          asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base Mainnet
          network: "base-mainnet",
          assetType: "ERC20",
          expiresAt: Math.floor(Date.now() / 1000) + 300, // 5 minutes
          nonce: Math.random().toString(36).substr(2, 9),
          paymentId: `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          debug: "x402: No X-PAYMENT header found - payment required"
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'X402',
            'X-PAYMENT-REQUIRED': 'true',
            'X-DEBUG': 'middleware-no-payment-header'
          }
        }
      );
    }
    
    // Payment header present - allow request to proceed
    console.log('x402: Payment header detected:', paymentHeader);
  }
  
  // Continue to the actual endpoint
  return;
}

export const config = {
  matcher: ["/api/tip"],
  runtime: "nodejs",
};

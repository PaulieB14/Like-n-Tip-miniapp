// Simple x402 middleware implementation
// Based on the actual x402 repository examples

export function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Only protect the tip endpoint
  if (url.pathname === '/api/tip') {
    console.log('🔍 MIDDLEWARE: Checking /api/tip request');
    
    // Check for payment header
    const paymentHeader = request.headers.get('X-PAYMENT');
    console.log('🔍 MIDDLEWARE: Payment header present:', !!paymentHeader);
    console.log('🔍 MIDDLEWARE: Payment header value:', paymentHeader ? paymentHeader.substring(0, 50) + '...' : 'null');
    
    if (!paymentHeader) {
      console.log('🔍 MIDDLEWARE: No payment header - returning 402');
      // Return 402 Payment Required with x402 response
      return new Response(
        JSON.stringify({
          x402Version: 1,
          accepts: [{
            scheme: "exact",
            network: "base",
            maxAmountRequired: "5000", // $0.005 in USDC units (6 decimals)
            resource: url.pathname,
            description: "Send tip to content creator",
            mimeType: "application/json",
            payTo: process.env.RESOURCE_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000",
            maxTimeoutSeconds: 30,
            asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
            extra: {
              name: "USD Coin",
              version: "2"
            }
          }]
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT-REQUIRED': 'true'
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

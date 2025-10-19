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
          accepts: [{
            scheme: "exact",
              network: "base-sepolia",
            maxAmountRequired: "5000", // $0.005 in USDC units (6 decimals)
            resource: url.pathname,
            description: "Send tip to content creator (Base Sepolia Testnet)",
            mimeType: "application/json",
            payTo: "0xf635FFE1d82bF0EC93587F4b24eDc296998d8436", // Default recipient address - updated
            maxTimeoutSeconds: 30,
            asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
            extra: {
              name: "USD Coin",
              version: "2"
            }
          }],
          debug: "MIDDLEWARE: No X-PAYMENT header found"
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
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

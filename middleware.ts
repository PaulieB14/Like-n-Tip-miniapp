// x402 middleware for gasless transactions
export function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Only protect the tip endpoint
  if (url.pathname === '/api/tip') {
    // Check for payment header
    const paymentHeader = request.headers.get('X-PAYMENT');
    
    if (!paymentHeader) {
      // Return 402 Payment Required with x402 headers
      return new Response(
        JSON.stringify({
          error: 'Payment required',
          amount: '$0.10',
          currency: 'USDC',
          network: 'base',
          message: 'This endpoint requires payment via x402 protocol'
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT-REQUIRED': 'true',
            'X-PAYMENT-AMOUNT': '$0.10',
            'X-PAYMENT-CURRENCY': 'USDC',
            'X-PAYMENT-NETWORK': 'base',
            'X-PAYMENT-FACILITATOR': 'coinbase'
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
  matcher: ['/api/tip'],
  runtime: 'nodejs',
};

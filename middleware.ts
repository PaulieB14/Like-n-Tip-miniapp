// x402 middleware is now handled by withX402 wrapper in the API routes
// This file is kept for Next.js config but doesn't handle x402 logic directly

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pass through - x402 payment handling is done in the API route using withX402
  return NextResponse.next()
}

export const config = {
  // Only match API routes that need x402 protection
  matcher: ['/api/tip'],
}

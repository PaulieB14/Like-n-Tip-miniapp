// app/api/auth/route.ts
import { createClient, Errors } from '@farcaster/quick-auth';
import { NextRequest, NextResponse } from 'next/server';

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'like-n-tip-miniapp.vercel.app';
const client = createClient();

// This endpoint returns the authenticated user's FID 
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = await client.verifyJwt({ token, domain });
    
    return NextResponse.json({
      fid: payload.sub,
      authenticated: true,
      domain: payload.aud,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    });
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    throw e;
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    console.log('Resolving Farcaster username:', username)
    
    // Step 1: Get FID from username using Farcaster API
    const userResponse = await fetch(`https://api.farcaster.xyz/v1/user-by-username?username=${username}`, {
      headers: {
        'User-Agent': 'Like-n-Tip-MiniApp/1.0'
      }
    })
    
    if (!userResponse.ok) {
      console.error('Failed to get FID for username:', username, userResponse.status)
      if (userResponse.status === 404) {
        return NextResponse.json({ error: `Username @${username} not found on Farcaster` }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to lookup username' }, { status: userResponse.status })
    }
    
    const userData = await userResponse.json()
    const fid = userData.result?.user?.fid
    
    if (!fid) {
      console.error('No FID found for username:', username)
      return NextResponse.json({ error: `No FID found for @${username}` }, { status: 404 })
    }
    
    console.log('Found FID for', username, ':', fid)
    
    // Step 2: Get primary Ethereum address using FID
    const addressResponse = await fetch(`https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`, {
      headers: {
        'User-Agent': 'Like-n-Tip-MiniApp/1.0'
      }
    })
    
    if (!addressResponse.ok) {
      console.error('Failed to get primary address for FID:', fid, addressResponse.status)
      return NextResponse.json({ error: `@${username} has no verified Ethereum wallet` }, { status: 404 })
    }
    
    const addressData = await addressResponse.json()
    const primaryAddress = addressData.result?.address
    
    if (!primaryAddress) {
      console.error('No primary address found for FID:', fid)
      return NextResponse.json({ error: `@${username} has no verified Ethereum wallet` }, { status: 404 })
    }
    
    console.log('Resolved address for', username, ':', primaryAddress)
    
    return NextResponse.json({
      success: true,
      username: username,
      fid: fid,
      address: primaryAddress
    })
    
  } catch (error: any) {
    console.error('Error resolving Farcaster address:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resolve Farcaster address' },
      { status: 500 }
    )
  }
}

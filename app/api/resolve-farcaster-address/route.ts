import { NextRequest, NextResponse } from 'next/server'
import { getAddress, isAddress } from 'viem'

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    console.log('Resolving Farcaster username:', username)

    // Step 1: Get FID from username using Fname Registry API
    let fid: number | null = null

    try {
      const fnameResponse = await fetch(`https://fnames.farcaster.xyz/transfers/current?name=${username}`, {
        headers: { 'User-Agent': 'Like-n-Tip-MiniApp/1.0' }
      })

      if (fnameResponse.ok) {
        const fnameData = await fnameResponse.json()
        if (fnameData?.transfer?.to) {
          fid = parseInt(fnameData.transfer.to)
          console.log('Found FID for', username, ':', fid)
        }
      }
    } catch (error) {
      console.error('Error looking up FID:', error)
    }

    if (!fid) {
      return NextResponse.json({
        error: `Username @${username} not found on Farcaster`
      }, { status: 404 })
    }

    // Step 2: Get primary Ethereum address using FID
    const addressResponse = await fetch(`https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`, {
      headers: { 'User-Agent': 'Like-n-Tip-MiniApp/1.0' }
    })

    if (!addressResponse.ok) {
      return NextResponse.json({ error: `@${username} has no verified Ethereum wallet` }, { status: 404 })
    }

    const addressData = await addressResponse.json()
    const primaryAddress = addressData.result?.address?.address

    if (!primaryAddress) {
      return NextResponse.json({ error: `@${username} has no verified Ethereum wallet` }, { status: 404 })
    }

    // Validate the address using viem
    if (!isAddress(primaryAddress)) {
      return NextResponse.json({ error: `Invalid address format for @${username}` }, { status: 400 })
    }

    const validatedAddress = getAddress(primaryAddress)

    return NextResponse.json({
      success: true,
      username: username,
      fid: fid,
      address: validatedAddress,
      source: 'primary_address'
    })

  } catch (error: any) {
    console.error('Error resolving Farcaster address:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resolve Farcaster address' },
      { status: 500 }
    )
  }
}

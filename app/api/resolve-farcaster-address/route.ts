import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, getAddress, isAddress, namehash } from 'viem'
import { base } from 'viem/chains'

// Base mainnet public client for Basename resolution
const baseClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org')
})

// Base Name Service resolver address
const BASE_RESOLVER = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD'

// Resolve a Basename (.base) to an address
async function resolveBasename(name: string): Promise<string | null> {
  try {
    // Add .base suffix if not present
    const fullName = name.endsWith('.base') ? name : `${name}.base`
    console.log('Resolving Basename:', fullName)

    // Use ENS-style resolution on Base
    const node = namehash(fullName)

    const address = await baseClient.readContract({
      address: BASE_RESOLVER,
      abi: [{
        name: 'addr',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ name: '', type: 'address' }]
      }],
      functionName: 'addr',
      args: [node]
    })

    if (address && address !== '0x0000000000000000000000000000000000000000') {
      console.log('Resolved Basename', fullName, 'to', address)
      return address as string
    }
    return null
  } catch (error) {
    console.error('Error resolving Basename:', error)
    return null
  }
}

// Resolve a Farcaster username to an address
async function resolveFarcasterUsername(username: string): Promise<{ fid: number; address: string } | null> {
  try {
    // Step 1: Get FID from username
    const fnameResponse = await fetch(`https://fnames.farcaster.xyz/transfers/current?name=${username}`, {
      headers: { 'User-Agent': 'Like-n-Tip-MiniApp/1.0' }
    })

    if (!fnameResponse.ok) return null

    const fnameData = await fnameResponse.json()
    const fid = fnameData?.transfer?.to ? parseInt(fnameData.transfer.to) : null
    if (!fid) return null

    console.log('Found FID for', username, ':', fid)

    // Step 2: Get primary address
    const addressResponse = await fetch(`https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`, {
      headers: { 'User-Agent': 'Like-n-Tip-MiniApp/1.0' }
    })

    if (!addressResponse.ok) return null

    const addressData = await addressResponse.json()
    const address = addressData.result?.address?.address
    if (!address || !isAddress(address)) return null

    return { fid, address: getAddress(address) }
  } catch (error) {
    console.error('Error resolving Farcaster username:', error)
    return null
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const originalName = searchParams.get('originalName') // The full name with suffix

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    console.log('Resolving username:', username, 'original:', originalName)

    // Check if this is a Basename (originally had .base suffix)
    if (originalName?.endsWith('.base')) {
      const basenameAddress = await resolveBasename(originalName)
      if (basenameAddress) {
        return NextResponse.json({
          success: true,
          username: originalName,
          address: getAddress(basenameAddress),
          source: 'basename'
        })
      }
    }

    // Try Farcaster resolution
    const farcasterResult = await resolveFarcasterUsername(username)
    if (farcasterResult) {
      return NextResponse.json({
        success: true,
        username: username,
        fid: farcasterResult.fid,
        address: farcasterResult.address,
        source: 'farcaster'
      })
    }

    // If username doesn't look like it had a suffix, also try as Basename
    const basenameAddress = await resolveBasename(username)
    if (basenameAddress) {
      return NextResponse.json({
        success: true,
        username: `${username}.base`,
        address: getAddress(basenameAddress),
        source: 'basename'
      })
    }

    return NextResponse.json({
      error: `Could not resolve @${username}. Not found on Farcaster or Base Name Service.`
    }, { status: 404 })

  } catch (error: any) {
    console.error('Error resolving address:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resolve address' },
      { status: 500 }
    )
  }
}

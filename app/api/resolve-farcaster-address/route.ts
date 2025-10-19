import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    console.log('Resolving Farcaster username:', username)
    
    // Step 1: Get FID from username using Fname Registry API
    // Based on Farcaster docs: https://docs.farcaster.xyz/developers/guides/accounts/find-by-name
    console.log('Looking up FID for username:', username)
    
    let fid: number | null = null
    
    try {
      // Use Fname Registry API to get FID from username
      const fnameResponse = await fetch(`https://fnames.farcaster.xyz/transfers/current?name=${username}`, {
        headers: {
          'User-Agent': 'Like-n-Tip-MiniApp/1.0'
        }
      })
      
      if (fnameResponse.ok) {
        const fnameData = await fnameResponse.json()
        console.log('Fname Registry response:', fnameData)
        
        // The response structure is: { "transfer": { "to": FID, ... } }
        if (fnameData && fnameData.transfer && fnameData.transfer.to) {
          fid = parseInt(fnameData.transfer.to)
          console.log('Found FID from Fname Registry for', username, ':', fid)
        }
      } else {
        console.log('Fname Registry lookup failed:', fnameResponse.status)
      }
    } catch (error) {
      console.error('Error looking up FID from Fname Registry:', error)
    }
    
    if (!fid) {
      console.error('No FID found for username:', username)
      return NextResponse.json({ 
        error: `Username @${username} not found or not registered on Farcaster. Please check the username or try a different user.` 
      }, { status: 404 })
    }
    
    console.log('Using FID for', username, ':', fid)
    
    // Step 2: Get primary Ethereum address using FID
    // Using the correct endpoint structure from the documentation
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
    // The response structure is: { "result": { "address": { "fid": 12152, "protocol": "ethereum", "address": "0x..." } } }
    const primaryAddress = addressData.result?.address?.address
    
    if (!primaryAddress) {
      console.log('No primary address found, checking creator rewards history for FID:', fid)
      
      // Fallback: Check creator rewards history for wallet address
      try {
        const rewardsResponse = await fetch(`https://api.farcaster.xyz/v1/creator-rewards-winner-history`, {
          headers: {
            'User-Agent': 'Like-n-Tip-MiniApp/1.0'
          }
        })
        
        if (rewardsResponse.ok) {
          const rewardsData = await rewardsResponse.json()
          const winners = rewardsData.result?.history?.winners || []
          
          // Look for the user in recent winners
          const userWinner = winners.find((winner: any) => winner.fid === fid && winner.walletAddress)
          
          if (userWinner && userWinner.walletAddress) {
            console.log('Found wallet address in creator rewards for', username, ':', userWinner.walletAddress)
            
            // Validate the address from creator rewards
            try {
              const validatedAddress = ethers.getAddress(userWinner.walletAddress)
              console.log('Validated creator rewards address:', validatedAddress)
              
              return NextResponse.json({
                success: true,
                username: username,
                fid: fid,
                address: validatedAddress,
                source: 'creator_rewards'
              })
            } catch (error) {
              console.error('Invalid address from creator rewards:', error, userWinner.walletAddress)
              // Continue to fallback error
            }
          }
        }
      } catch (rewardsError) {
        console.error('Error checking creator rewards:', rewardsError)
      }
      
      console.error('No wallet address found for FID:', fid)
      return NextResponse.json({ error: `@${username} has no verified Ethereum wallet` }, { status: 404 })
    }
    
    console.log('Resolved address for', username, ':', primaryAddress)
    
    // Validate the address using ethers
    try {
      const validatedAddress = ethers.getAddress(primaryAddress)
      console.log('Validated address:', validatedAddress)
      
      return NextResponse.json({
        success: true,
        username: username,
        fid: fid,
        address: validatedAddress,
        source: 'primary_address'
      })
    } catch (error) {
      console.error('Invalid address from Farcaster API:', error, primaryAddress)
      return NextResponse.json({ 
        error: `Invalid address format for @${username}` 
      }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error('Error resolving Farcaster address:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resolve Farcaster address' },
      { status: 500 }
    )
  }
}

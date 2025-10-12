import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo purposes
// In production, use a proper database
const userNotificationDetails = new Map<number, { url: string; token: string }>()

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json()
    console.log('Webhook received:', requestJson)
    
    // Parse and verify the webhook event
    let data
    try {
      // For now, we'll skip signature verification in development
      // In production, you should validate the webhook signature
      data = requestJson
    } catch (e: unknown) {
      console.error('Webhook verification error:', e)
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const fid = data.fid
    const event = data.event

    // Handle different event types
    switch (event.event) {
      case "miniapp_added":
        console.log('Mini app added for FID:', fid)
        // Save notification details and send welcome notification
        if (event.notificationDetails) {
          userNotificationDetails.set(fid, event.notificationDetails)
          console.log('Notification details saved for FID:', fid)
          
          // Send welcome notification
          await sendMiniAppNotification({
            fid,
            title: "Welcome to Like n Tip!",
            body: "Your auto-tip mini app is now ready to use",
          })
        }
        break

      case "miniapp_removed":
        console.log('Mini app removed for FID:', fid)
        // Delete notification details
        userNotificationDetails.delete(fid)
        break

      case "notifications_enabled":
        console.log('Notifications enabled for FID:', fid)
        // Save new notification details and send confirmation
        if (event.notificationDetails) {
          userNotificationDetails.set(fid, event.notificationDetails)
          await sendMiniAppNotification({
            fid,
            title: "Notifications Enabled! 🔔",
            body: "You'll now receive updates from Like n Tip",
          })
        }
        break

      case "notifications_disabled":
        console.log('Notifications disabled for FID:', fid)
        // Delete notification details
        userNotificationDetails.delete(fid)
        break

      default:
        console.log('Unknown event type:', event.event)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Function to send notifications
async function sendMiniAppNotification({
  fid,
  title,
  body,
}: {
  fid: number;
  title: string;
  body: string;
}): Promise<void> {
  const notificationDetails = userNotificationDetails.get(fid)
  if (!notificationDetails) {
    console.log('No notification details found for FID:', fid)
    return
  }

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: crypto.randomUUID(),
        title,
        body,
        targetUrl: "https://like-n-tip-miniapp.vercel.app",
        tokens: [notificationDetails.token],
      }),
    })

    if (response.status === 200) {
      console.log('Notification sent successfully to FID:', fid)
    } else {
      console.error('Failed to send notification to FID:', fid, response.status)
    }
  } catch (error) {
    console.error('Error sending notification to FID:', fid, error)
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'LIke n Tip webhook endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}

import { createPushSubscription, deletePushSubscriptionByEndpoint } from '@/lib/push-subscriptions'
import { getCurrentUserServer } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { endpoint, p256dh, auth } = await request.json()

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subscription = await createPushSubscription({
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
    })

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error('Error creating push subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 })
    }

    await deletePushSubscriptionByEndpoint(endpoint)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting push subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

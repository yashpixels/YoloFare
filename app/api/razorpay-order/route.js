import crypto from 'crypto'
import { sendCapiEvent, getClientIp, parseCookie } from '../../../lib/meta-capi'

export async function POST(request) {
  try {
    const { userId, email, fbc, fbp } = await request.json()
    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })

    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const auth      = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const headers   = { 'Content-Type': 'application/json', 'Authorization': auth }

    // Get or create the monthly plan
    let planId = process.env.RAZORPAY_PLAN_ID
    if (!planId) {
      const planRes = await fetch('https://api.razorpay.com/v1/plans', {
        method: 'POST', headers,
        body: JSON.stringify({
          period: 'monthly',
          interval: 1,
          item: {
            name: 'YoloFare Pro',
            amount: 99900,
            currency: 'INR',
            description: 'YoloFare Pro — Monthly subscription',
          },
        }),
      })
      const plan = await planRes.json()
      if (!planRes.ok) throw new Error(plan.error?.description || 'Plan creation failed')
      planId = plan.id
      console.log('[YoloFare] Created Razorpay plan:', planId, '— Add RAZORPAY_PLAN_ID to Vercel env vars')
    }

    // Create the subscription
    const subRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST', headers,
      body: JSON.stringify({
        plan_id:         planId,
        total_count:     120,   // 10 years — effectively unlimited
        quantity:        1,
        customer_notify: 1,
        notes:           { userId, plan: 'pro' },
      }),
    })
    const subscription = await subRes.json()
    if (!subRes.ok) throw new Error(subscription.error?.description || 'Subscription creation failed')

    // Generate event_id for Meta deduplication
    const eventId = crypto.randomUUID()

    // Fire server-side InitiateCheckout CAPI
    const cookieHeader = request.headers.get('cookie')
    sendCapiEvent({
      eventName:  'InitiateCheckout',
      eventId,
      ip:         getClientIp(request),
      userAgent:  request.headers.get('user-agent') || undefined,
      email:      email || undefined,
      fbc:        fbc || parseCookie(cookieHeader, '_fbc'),
      fbp:        fbp || parseCookie(cookieHeader, '_fbp'),
      customData: { value: 999, currency: 'INR', content_name: 'YoloFare Pro', num_items: 1 },
    }).catch(() => {})

    return Response.json({ subscriptionId: subscription.id, eventId })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

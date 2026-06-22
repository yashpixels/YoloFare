import crypto from 'crypto'
import { sendCapiEvent, getClientIp, parseCookie } from '../../../lib/meta-capi'

export async function POST(request) {
  try {
    const { userId, email, fbc, fbp } = await request.json()
    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })

    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const shortId   = userId.slice(-8)
    const ts        = Date.now().toString(36)
    const receipt   = `yf_${shortId}_${ts}`

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
      },
      body: JSON.stringify({
        amount:   99900,
        currency: 'INR',
        receipt,
        notes: { userId, plan: 'pro' },
      }),
    })

    const order = await response.json()
    if (!response.ok) throw new Error(order.error?.description || 'Order creation failed')

    // Generate event_id so the client can use the same ID in fbq() for deduplication
    const eventId = crypto.randomUUID()

    // Fire server-side InitiateCheckout — bypasses ad blockers
    const cookieHeader = request.headers.get('cookie')
    sendCapiEvent({
      eventName:      'InitiateCheckout',
      eventId,
      ip:             getClientIp(request),
      userAgent:      request.headers.get('user-agent') || undefined,
      email:          email || undefined,
      fbc:            fbc || parseCookie(cookieHeader, '_fbc'),
      fbp:            fbp || parseCookie(cookieHeader, '_fbp'),
      customData: {
        value:        999,
        currency:     'INR',
        content_name: 'YoloFare Pro',
        num_items:    1,
      },
    }).catch(() => {}) // fire-and-forget, don't block checkout

    return Response.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      eventId,  // client uses this same ID in fbq() to deduplicate
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { sendCapiEvent, getClientIp, parseCookie } from '../../../lib/meta-capi'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      userId,
      fbc,
      fbp,
      purchaseEventId,
    } = await request.json()

    // Verify Razorpay subscription signature
    // Formula: HMAC-SHA256(payment_id + '|' + subscription_id, key_secret)
    const body     = razorpay_payment_id + '|' + razorpay_subscription_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return Response.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Activate subscription — expires 1 month from now (webhook extends this on renewal)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    const { error } = await supabase.from('subscriptions').upsert({
      user_id:                  userId,
      plan:                     'pro',
      status:                   'active',
      razorpay_subscription_id: razorpay_subscription_id,
      expires_at:               expiresAt.toISOString(),
    }, { onConflict: 'user_id' })

    if (error) throw error

    // Look up user email for CAPI signal quality
    const { data: authData } = await supabase.auth.admin.getUserById(userId)
    const email = authData?.user?.email

    const cookieHeader = request.headers.get('cookie')
    const eventId      = purchaseEventId || crypto.randomUUID()
    const ip           = getClientIp(request)
    const userAgent    = request.headers.get('user-agent') || undefined
    const capiBase     = {
      ip, userAgent, email,
      fbc: fbc || parseCookie(cookieHeader, '_fbc'),
      fbp: fbp || parseCookie(cookieHeader, '_fbp'),
    }

    await Promise.allSettled([
      sendCapiEvent({
        ...capiBase,
        eventName:  'Purchase',
        eventId,
        customData: { value: 999, currency: 'INR', content_name: 'YoloFare Pro', content_type: 'product' },
      }),
      sendCapiEvent({
        ...capiBase,
        eventName:  'Subscribe',
        eventId:    crypto.randomUUID(),
        customData: { value: 999, currency: 'INR', predicted_ltv: '11988' },
      }),
    ])

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await request.json()

    // Verify Razorpay signature
    const body      = razorpay_order_id + '|' + razorpay_payment_id
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return Response.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Save subscription to Supabase
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month from now

    const { error } = await supabase.from('subscriptions').upsert({
      user_id:                  userId,
      plan:                     'pro',
      status:                   'active',
      razorpay_subscription_id: razorpay_payment_id,
      expires_at:               expiresAt.toISOString(),
    }, { onConflict: 'user_id' })

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

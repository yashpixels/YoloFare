export const dynamic = 'force-dynamic'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body      = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (webhookSecret) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')
      if (expected !== signature) {
        return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(body)
    const subscriptionEntity = event.payload?.subscription?.entity
    const subscriptionId     = subscriptionEntity?.id

    // subscription.charged — monthly renewal, extend expires_at by 1 month
    if (event.event === 'subscription.charged') {
      if (!subscriptionId) return Response.json({ ok: true })

      const newExpiry = new Date()
      newExpiry.setMonth(newExpiry.getMonth() + 1)

      await supabase
        .from('subscriptions')
        .update({ status: 'active', expires_at: newExpiry.toISOString() })
        .eq('razorpay_subscription_id', subscriptionId)

      console.log('[webhook] Renewed subscription:', subscriptionId, 'until', newExpiry.toISOString())
    }

    // subscription.cancelled or subscription.halted — user cancelled or payments failed
    if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      if (!subscriptionId) return Response.json({ ok: true })

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('razorpay_subscription_id', subscriptionId)

      console.log('[webhook] Cancelled subscription:', subscriptionId, '— event:', event.event)
    }

    // subscription.activated — first payment confirmed by Razorpay (backup to verify-payment)
    if (event.event === 'subscription.activated') {
      if (!subscriptionId) return Response.json({ ok: true })
      const notes = subscriptionEntity?.notes || {}
      if (notes.userId) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
        await supabase.from('subscriptions').upsert({
          user_id:                  notes.userId,
          plan:                     'pro',
          status:                   'active',
          razorpay_subscription_id: subscriptionId,
          expires_at:               expiresAt.toISOString(),
        }, { onConflict: 'user_id' })
      }
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('[webhook] Error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

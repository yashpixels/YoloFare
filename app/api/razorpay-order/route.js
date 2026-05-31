import crypto from 'crypto'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })

    const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Receipt max 40 chars — use short hash of userId + base36 timestamp
    const shortId = userId.slice(-8)
    const ts      = Date.now().toString(36)
    const receipt = `yf_${shortId}_${ts}` // ~22 chars, well under 40

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
      },
      body: JSON.stringify({
        amount:   100,        // ₹1 in paise for testing (change to 99900 for ₹999 in production)
        currency: 'INR',
        receipt,
        notes: { userId, plan: 'pro' },
      }),
    })

    const order = await response.json()
    if (!response.ok) throw new Error(order.error?.description || 'Order creation failed')

    return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

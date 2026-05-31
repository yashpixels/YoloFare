import crypto from 'crypto'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })

    const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Create order via Razorpay REST API — ₹1 = 100 paise for testing
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
      },
      body: JSON.stringify({
        amount: 100,           // ₹1 in paise — change to 99900 for ₹999 in production
        currency: 'INR',
        receipt: `yolofare_${userId}_${Date.now()}`,
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

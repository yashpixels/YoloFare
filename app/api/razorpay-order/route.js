import crypto from 'crypto'
export async function POST(request) {
  try {
    const { userId } = await request.json()
    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })
    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const shortId = userId.slice(-8)
    const ts      = Date.now().toString(36)
    const receipt = `yf_${shortId}_${ts}`
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
    return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
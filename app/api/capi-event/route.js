import { sendCapiEvent, getClientIp, parseCookie } from '../../../lib/meta-capi'

export async function POST(request) {
  try {
    const { eventName, eventId, eventSourceUrl, email, fbc, fbp, customData } = await request.json()
    if (!eventName || !eventId) {
      return Response.json({ error: 'Missing eventName or eventId' }, { status: 400 })
    }

    const cookieHeader = request.headers.get('cookie')
    await sendCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || 'https://www.yolofare.com',
      ip:        getClientIp(request),
      userAgent: request.headers.get('user-agent') || undefined,
      email:     email || undefined,
      fbc:       fbc || parseCookie(cookieHeader, '_fbc'),
      fbp:       fbp || parseCookie(cookieHeader, '_fbp'),
      customData,
    })

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

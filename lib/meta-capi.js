import crypto from 'crypto'

const PIXEL_ID = '2564814423972147'

function sha256(value) {
  if (!value) return undefined
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

/**
 * Send a server-side event to Meta Conversions API.
 *
 * @param {object} opts
 * @param {string}  opts.eventName       - e.g. 'InitiateCheckout', 'Purchase'
 * @param {string}  opts.eventId         - UUID for deduplication with browser pixel
 * @param {string} [opts.eventSourceUrl] - Page URL where the action occurred
 * @param {string} [opts.ip]             - Client IP (from request headers)
 * @param {string} [opts.userAgent]      - Client UA (from request headers)
 * @param {string} [opts.email]          - User email (will be SHA256-hashed)
 * @param {string} [opts.fbc]            - _fbc cookie value
 * @param {string} [opts.fbp]            - _fbp cookie value
 * @param {object} [opts.customData]     - Event-specific payload (value, currency, etc.)
 */
export async function sendCapiEvent({
  eventName,
  eventId,
  eventSourceUrl = 'https://www.yolofare.com/pricing',
  ip,
  userAgent,
  email,
  fbc,
  fbp,
  customData,
}) {
  const token = process.env.META_CAPI_TOKEN
  if (!token) {
    console.warn('[CAPI] META_CAPI_TOKEN not set — skipping server-side event:', eventName)
    return
  }

  const userData = {
    ...(email     && { em: sha256(email) }),
    ...(ip        && { client_ip_address: ip }),
    ...(userAgent && { client_user_agent: userAgent }),
    ...(fbc       && { fbc }),
    ...(fbp       && { fbp }),
  }

  const payload = {
    data: [{
      event_name:       eventName,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      event_source_url: eventSourceUrl,
      action_source:    'website',
      user_data:        userData,
      ...(customData && { custom_data: customData }),
    }],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      }
    )
    const json = await res.json()
    if (!res.ok) console.error('[CAPI] API error:', JSON.stringify(json))
    return json
  } catch (err) {
    console.error('[CAPI] Fetch failed:', err.message)
  }
}

/** Extract client IP from Next.js request headers (handles proxies). */
export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined
  )
}

/** Parse a named cookie from the Cookie header string. */
export function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export const FB_PIXEL_ID = '2564814423972147'

function safeFbq(...args) {
  if (typeof window === 'undefined') return
  if (window.fbq) window.fbq(...args)
}

/** Generate a UUID for event deduplication */
function genEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Read a cookie value from document.cookie */
function getCookie(name) {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[1]) : undefined
}

/**
 * Get fbc: from _fbc cookie, or construct from fbclid URL param if cookie not set yet.
 * This covers the race condition where fbclid is in the URL but the cookie
 * hasn't been written yet when the first CAPI event fires.
 */
function getFbc() {
  const fromCookie = getCookie('_fbc')
  if (fromCookie) return fromCookie
  if (typeof window === 'undefined') return undefined
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined
}

/**
 * Mirror a browser pixel event to our CAPI proxy route.
 * Explicitly sends fbc/fbp from the browser so the server always has them,
 * rather than relying on the Cookie header which may lag behind.
 * Fire-and-forget — never awaited.
 */
function capiProxy(eventName, eventId, customData, email) {
  if (typeof window === 'undefined') return
  const fbc = getFbc()
  const fbp = getCookie('_fbp')
  fetch('/api/capi-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      customData,
      ...(email && { email }),
      ...(fbc   && { fbc }),
      ...(fbp   && { fbp }),
    }),
  }).catch(() => {})
}

// Fires on every page load - in FacebookPixel.js
// Generates eventID so browser pixel and CAPI proxy can be deduplicated by Meta
export const pageview = () => {
  const eventId = genEventId()
  safeFbq('track', 'PageView', {}, { eventID: eventId })
  capiProxy('PageView', eventId, undefined)
}

// Fires when user views a deal page - on /deals/${id} page load
export const trackViewContent = (dealName, price) => {
  const eventId = genEventId()
  const data = { content_name: dealName, content_category: 'Flight Deal', value: price, currency: 'INR' }
  safeFbq('track', 'ViewContent', data, { eventID: eventId })
  capiProxy('ViewContent', eventId, data)
}

// Fires when user clicks Upgrade to Pro button
export const trackAddToCart = () => {
  const eventId = genEventId()
  const data = { value: 999, currency: 'INR', content_name: 'YoloFare Pro', content_type: 'product' }
  safeFbq('track', 'AddToCart', data, { eventID: eventId })
  capiProxy('AddToCart', eventId, data)
}

// Fires when Razorpay modal opens (eventId from server enables CAPI deduplication)
export const trackInitiateCheckout = (eventId) => safeFbq(
  'track', 'InitiateCheckout',
  { value: 999, currency: 'INR', content_name: 'YoloFare Pro' },
  ...(eventId ? [{ eventID: eventId }] : [])
)

// Fires after payment verified (eventId from server enables CAPI deduplication)
export const trackProPurchase = (eventId) => {
  safeFbq(
    'track', 'Purchase',
    { value: 999, currency: 'INR', content_name: 'YoloFare Pro', content_type: 'product' },
    ...(eventId ? [{ eventID: eventId }] : [])
  )
  safeFbq('track', 'Subscribe', { value: 999, currency: 'INR', predicted_ltv: '11988' })
}

// Fires when user signs up / creates account
export const trackCompleteRegistration = () => safeFbq('track', 'CompleteRegistration', {
  content_name: 'YoloFare Signup',
  currency: 'INR',
  value: 0,
})

// Fires when user submits magic link form (pass email for better CAPI match quality)
export const trackLead = (email) => {
  const eventId = genEventId()
  const data = { content_name: 'Magic Link Request', currency: 'INR', value: 0 }
  safeFbq('track', 'Lead', data, { eventID: eventId })
  capiProxy('Lead', eventId, data, email)
}

// Fires when user clicks "Book on Google Flights" on a deal page
export const trackBookingClick = (dealName, price) => {
  const eventId = genEventId()
  const data = { content_name: dealName, content_category: 'Flight Deal', value: price, currency: 'INR' }
  safeFbq('trackCustom', 'BookingClick', data, { eventID: eventId })
  capiProxy('BookingClick', eventId, data)
}

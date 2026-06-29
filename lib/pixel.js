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

/**
 * Mirror a browser pixel event to our CAPI proxy route.
 * The same eventId is passed to fbq so Meta deduplicates them.
 * Fire-and-forget — never awaited.
 */
function capiProxy(eventName, eventId, customData, email) {
  if (typeof window === 'undefined') return
  fetch('/api/capi-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      customData,
      ...(email && { email }),
    }),
  }).catch(() => {})
}

// Fires on every page load - in FacebookPixel.js
export const pageview = () => safeFbq('track', 'PageView')

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

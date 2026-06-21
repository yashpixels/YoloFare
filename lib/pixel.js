export const FB_PIXEL_ID = '2564814423972147'

function safeFbq(...args) {
  if (typeof window === 'undefined') return
  if (window.fbq) window.fbq(...args)
}

// Fires on every page load - in FacebookPixel.js
export const pageview = () => safeFbq('track', 'PageView')

// Fires when user views a deal page - on /deals/${id} page load
export const trackViewContent = (dealName, price) => safeFbq('track', 'ViewContent', {
  content_name: dealName,
  content_category: 'Flight Deal',
  value: price,
  currency: 'INR',
})

// Fires when user clicks Upgrade to Pro button
export const trackAddToCart = () => safeFbq('track', 'AddToCart', {
  value: 999,
  currency: 'INR',
  content_name: 'YoloFare Pro',
  content_type: 'product',
})

// Fires when Razorpay modal opens
export const trackInitiateCheckout = () => safeFbq('track', 'InitiateCheckout', {
  value: 999,
  currency: 'INR',
  content_name: 'YoloFare Pro',
})

// Fires after payment verified - subscription
export const trackProPurchase = () => {
  safeFbq('track', 'Purchase', {
    value: 999,
    currency: 'INR',
    content_name: 'YoloFare Pro',
    content_type: 'product',
  })
  safeFbq('track', 'Subscribe', {
    value: 999,
    currency: 'INR',
    predicted_ltv: '11988',
  })
}

// Fires when user signs up / creates account
export const trackCompleteRegistration = () => safeFbq('track', 'CompleteRegistration', {
  content_name: 'YoloFare Signup',
  currency: 'INR',
  value: 0,
})

// Fires when user submits magic link form
export const trackLead = () => safeFbq('track', 'Lead', {
  content_name: 'Magic Link Request',
  currency: 'INR',
  value: 0,
})
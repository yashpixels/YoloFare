export const FB_PIXEL_ID = '2564814423972147'

function safeFbq(...args) {
  if (typeof window === 'undefined') return
  if (window.fbq && window.fbq.callMethod) {
    window.fbq(...args)
  } else if (window._fbq) {
    window._fbq(...args)
  }
}

export const pageview = () => {
  safeFbq('track', 'PageView')
}

export const trackDealClick = (dealName, price) => {
  safeFbq('track', 'ViewContent', {
    content_name: dealName,
    content_category: 'Flight Deal',
    value: price,
    currency: 'INR',
  })
}

export const trackProPurchase = () => {
  safeFbq('track', 'Purchase', {
    value: 999,
    currency: 'INR',
    content_name: 'YoloFare Pro',
    content_type: 'product',
  })
}

export const trackAddToCart = () => {
  safeFbq('track', 'AddToCart', {
    value: 999,
    currency: 'INR',
    content_name: 'YoloFare Pro',
    content_type: 'product',
  })
}
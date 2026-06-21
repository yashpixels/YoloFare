export const FB_PIXEL_ID = '2564814423972147'

export const pageview = () => {
  window.fbq('track', 'PageView')
}

export const trackDealClick = (dealName, price) => {
  window.fbq('track', 'ViewContent', {
    content_name: dealName,
    content_category: 'Flight Deal',
    value: price,
    currency: 'INR',
  })
}

export const trackProPurchase = () => {
  window.fbq('track', 'Purchase', {
    value: 999,
    currency: 'INR',
    content_name: 'YoloFare Pro',
    content_type: 'product',
  })
}


export const trackAddToCart = () => {
  window.fbq('track', 'AddToCart', {
    value: 999,
    currency: 'INR',
    content_name: 'YoloFare Pro',
    content_type: 'product',
  })
}
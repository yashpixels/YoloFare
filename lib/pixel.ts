export const FB_PIXEL_ID = '4407808209498127'

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}

export const pageview = () => {
  window.fbq('track', 'PageView')
}

export const trackDealClick = (dealName: string, price: number) => {
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

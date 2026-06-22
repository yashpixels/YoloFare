import { headers } from 'next/headers'
import { sendCapiEvent, parseCookie } from '../../lib/meta-capi'

export const metadata = {
  title: 'Pricing — Free vs Pro Flight Deal Alerts | YoloFare',
  description: 'YoloFare Pro unlocks all international flight deals, WhatsApp alerts & personalised wishlist for ₹999/month. Average member saves ₹18,000 per trip.',
  alternates: {
    canonical: 'https://www.yolofare.com/pricing',
  },
  openGraph: {
    title: 'YoloFare Pro — ₹999/month for All Flight Deals',
    description: 'Unlock all cheap international flight deals from India. WhatsApp alerts, personalised wishlist, Business & First Class included.',
    url: 'https://www.yolofare.com/pricing',
  },
}

export default async function PricingLayout({ children }) {
  // Fire server-side PageView the moment this page is requested.
  // This bypasses ad blockers and pixel load delays — critical for mobile users
  // who bounce before fbevents.js finishes loading.
  try {
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie') || ''
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
              || headersList.get('x-real-ip')
              || undefined
    const userAgent = headersList.get('user-agent') || undefined

    sendCapiEvent({
      eventName:      'PageView',
      eventId:        `pv-pricing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventSourceUrl: 'https://www.yolofare.com/pricing',
      ip,
      userAgent,
      fbc: parseCookie(cookieHeader, '_fbc'),
      fbp: parseCookie(cookieHeader, '_fbp'),
    }).catch(() => {})
  } catch (_) {}

  return children
}

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

export default function PricingLayout({ children }) {
  return (
    <>
      {/* Preload Razorpay so it's ready before the user clicks Upgrade */}
      <link rel="preload" href="https://checkout.razorpay.com/v1/checkout.js" as="script" />
      {children}
    </>
  )
}

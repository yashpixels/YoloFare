// Add this export to the TOP of app/deals/page.js (before the component)
// If deals/page.js is a client component, create app/deals/layout.js instead and put this there.

export const metadata = {
  title: 'International Flight Deals from India | Cheap Flights 2026',
  description: 'Browse handpicked cheap international flight deals from Delhi, Mumbai, Bangalore, Hyderabad & Chennai. Economy, Business & First Class. Updated daily.',
  alternates: {
    canonical: 'https://www.yolofare.com/deals',
  },
  openGraph: {
    title: 'International Flight Deals from India | YoloFare',
    description: 'Cheap international flights from Delhi, Mumbai, Bangalore & more. Save 40–70% on every booking.',
    url: 'https://www.yolofare.com/deals',
  },
}

export default function DealsLayout({ children }) { return children }

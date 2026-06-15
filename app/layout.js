import FacebookPixel from '../components/FacebookPixel'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://www.yolofare.com'),
  title: {
    default: 'YoloFare â€” Cheap International Flights from India | Flight Deals',
    template: '%s | YoloFare',
  },
  description: 'YoloFare finds cheap international flight deals from Delhi, Mumbai, Bangalore, Hyderabad & Chennai. Save â‚¹18,000+ per trip. Economy, Business & First Class deals updated daily.',
  keywords: [
    'cheap international flights from India',
    'flight deals from Delhi',
    'flight deals from Mumbai',
    'cheap flights from Bangalore',
    'international flight offers India',
    'cheap business class flights India',
    'flight deals India 2026',
    'cheap flights to Europe from India',
    'cheap flights to Southeast Asia from India',
    'best flight deals India',
    'YoloFare',
  ],
  authors: [{ name: 'YoloFare' }],
  creator: 'YoloFare',
  publisher: 'YoloFare',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.yolofare.com',
    siteName: 'YoloFare',
    title: 'YoloFare â€” Cheap International Flights from India',
    description: 'Handpicked international flight deals from Delhi, Mumbai, Bangalore, Hyderabad & Chennai. Save 40â€“70% on Economy, Business & First Class.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YoloFare â€” Cheap International Flight Deals from India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoloFare â€” Cheap International Flights from India',
    description: 'Handpicked flight deals from Delhi, Mumbai, Bangalore & more. Save â‚¹18,000+ per trip.',
    images: ['/og-image.png'],
    creator: '@yolofare',
  },
  alternates: {
    canonical: 'https://www.yolofare.com',
  },
  verification: { google: "2dde3cba2535f84e" },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.yolofare.com/#website',
      url: 'https://www.yolofare.com',
      name: 'YoloFare',
      description: 'Cheap international flight deals from India',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.yolofare.com/deals?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.yolofare.com/#organization',
      name: 'YoloFare',
      url: 'https://www.yolofare.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.yolofare.com/logo.png',
      },
      description: 'YoloFare curates cheap international flight deals for Indian travelers from Delhi, Mumbai, Bangalore, Hyderabad and Chennai.',
      areaServed: 'IN',
      serviceType: 'Flight Deal Alerts',
    },
    {
      '@type': 'Service',
      '@id': 'https://www.yolofare.com/#service',
      name: 'YoloFare Flight Deal Alerts',
      provider: { '@id': 'https://www.yolofare.com/#organization' },
      description: 'Curated international flight deals from major Indian cities with WhatsApp and email alerts for Pro members.',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: '0',
          priceCurrency: 'INR',
          description: '3 free flight deals visible, South East Asia only',
        },
        {
          '@type': 'Offer',
          name: 'Pro Plan',
          price: '999',
          priceCurrency: 'INR',
          billingIncrement: 'P1M',
          description: 'All flight deals unlocked, WhatsApp alerts, personalised to your wishlist',
        },
      ],
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="5NbhqF9DBg7zqw" />`n      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <FacebookPixel />{children}</body>
    </html>
  )
}




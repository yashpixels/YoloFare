import Link from 'next/link'

export const metadata = {
  title: 'About YoloFare — Cheap International Flight Deals from India',
  description: 'YoloFare is a flight deal alert service for Indian travellers. We find cheap international flights from Delhi, Mumbai, Bangalore, Hyderabad & Chennai — with no middlemen, no agency fees.',
  alternates: { canonical: 'https://www.yolofare.com/about' },
  openGraph: {
    title: 'About YoloFare — Cheap International Flight Deals from India',
    description: 'YoloFare finds cheap international flights from India with no middlemen or OTA commissions. Real-time WhatsApp alerts for Pro members.',
    url: 'https://www.yolofare.com/about',
    siteName: 'YoloFare',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About YoloFare',
  url: 'https://www.yolofare.com/about',
  description: 'YoloFare is an international flight deal alert service for Indian travellers with no middlemen or agency commissions.',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://www.yolofare.com/#organization',
    name: 'YoloFare',
    alternateName: 'Yolo Fare',
    url: 'https://www.yolofare.com',
    foundingLocation: { '@type': 'Place', name: 'India' },
    description: 'YoloFare is a subscription-based international flight deal alert service for Indian travellers. We curate deeply discounted flight deals from Delhi, Mumbai, Bangalore, Hyderabad and Chennai — covering Economy, Business and First Class — with no middlemen, no OTA commissions, and real-time WhatsApp alerts.',
    areaServed: { '@type': 'Country', name: 'India' },
    serviceType: 'Flight Deal Alerts',
    sameAs: [
      'https://www.instagram.com/yolofare/',
      'https://www.facebook.com/profile.php?id=61590526933553',
    ],
  },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1a1a1a', background: '#fff', minHeight: '100vh' }}>

        {/* Nav */}
        <nav style={{ borderBottom: '1px solid #f0f0f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, textDecoration: 'none', color: '#1a1a1a' }}>
            Yolo<span style={{ color: '#FF5C3A' }}>Fare</span>
          </Link>
          <Link href="/deals" style={{ background: '#FF5C3A', color: '#fff', padding: '8px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            See Deals →
          </Link>
        </nav>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#111', marginBottom: 20, lineHeight: 1.2 }}>
            About YoloFare
          </h1>

          <p style={{ fontSize: 18, color: '#444', lineHeight: 1.8, marginBottom: 24 }}>
            <strong>YoloFare</strong> is an international flight deal alert service built for Indian travellers.
            We find and curate deeply discounted flight deals departing from <strong>Delhi, Mumbai, Bangalore, Hyderabad, and Chennai</strong> — and alert our members the moment a deal drops.
          </p>

          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, marginBottom: 24 }}>
            Unlike most flight deal aggregators, YoloFare operates with <strong>zero middlemen</strong>. We don't earn affiliate commissions from airlines or OTAs — which means every deal we publish is the genuinely cheapest fare we found, not the cheapest fare that happens to pay us the most.
          </p>

          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, marginBottom: 24 }}>
            We cover <strong>Economy, Business, and First Class</strong> deals to destinations across South East Asia, Europe, the Middle East, USA, Canada, Australia, and more. Pro members receive instant <strong>WhatsApp alerts</strong> so they can book before a fare disappears.
          </p>

          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#111', margin: '40px 0 16px' }}>
            What YoloFare Is Not
          </h2>
          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>
            YoloFare is not a travel agency. We do not book flights on your behalf and we do not charge booking fees.
            We are not affiliated with Yulu, Yuluride, or any bicycle or micro-mobility service.
            YoloFare is exclusively a <strong>flight deal intelligence service</strong> for international travel from India.
          </p>

          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#111', margin: '40px 0 16px' }}>
            How It Works
          </h2>
          <ol style={{ fontSize: 16, color: '#555', lineHeight: 2, paddingLeft: 20 }}>
            <li>Our team monitors airline pricing daily across all major routes from India.</li>
            <li>When we spot a fare that's 40%+ below the historical average, we hand-verify it.</li>
            <li>We publish it on <Link href="/deals" style={{ color: '#FF5C3A' }}>yolofare.com/deals</Link> within minutes.</li>
            <li>Pro members get a WhatsApp alert instantly so they can book before it's gone.</li>
          </ol>

          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#111', margin: '40px 0 16px' }}>
            Follow YoloFare
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/yolofare/" target="_blank" rel="noopener noreferrer" style={{ background: '#f5f5f5', color: '#333', padding: '10px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid #e8e8e8' }}>
              Instagram @yolofare
            </a>
            <a href="https://www.facebook.com/profile.php?id=61590526933553" target="_blank" rel="noopener noreferrer" style={{ background: '#f5f5f5', color: '#333', padding: '10px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid #e8e8e8' }}>
              Facebook — YoloFare
            </a>
          </div>

          <div style={{ marginTop: 56, background: '#0D0A08', borderRadius: 20, padding: '36px 28px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#FFF5EC', marginBottom: 8 }}>Ready to find your next deal?</p>
            <p style={{ color: 'rgba(255,245,236,0.55)', fontSize: 15, marginBottom: 24 }}>3 free deals. No signup needed.</p>
            <Link href="/deals" style={{ background: '#FF5C3A', color: '#fff', padding: '13px 28px', borderRadius: 100, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Browse Deals →
            </Link>
          </div>

        </div>

        <footer style={{ borderTop: '1px solid #f0f0f0', padding: '24px', textAlign: 'center', fontSize: 13, color: '#aaa' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#1a1a1a', textDecoration: 'none', marginRight: 24 }}>
            Yolo<span style={{ color: '#FF5C3A' }}>Fare</span>
          </Link>
          <Link href="/deals" style={{ color: '#aaa', textDecoration: 'none', marginRight: 16 }}>Deals</Link>
          <Link href="/pricing" style={{ color: '#aaa', textDecoration: 'none', marginRight: 16 }}>Pricing</Link>
          <Link href="/about" style={{ color: '#aaa', textDecoration: 'none' }}>About</Link>
        </footer>

      </div>
    </>
  )
}

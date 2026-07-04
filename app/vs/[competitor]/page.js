import Link from 'next/link'

const COMPETITORS = {
  makemytrip: {
    name: 'MakeMyTrip',
    tagline: 'YoloFare vs MakeMyTrip — Why an OTA Is Not a Deal Intelligence Service',
    description: 'MakeMyTrip books flights and earns commissions doing it. YoloFare finds the genuinely cheapest fares and alerts you instantly — zero service fees, zero OTA markup, zero incentive to upsell you.',
    metaDesc: 'YoloFare vs MakeMyTrip: Why a deal alert service beats an OTA for cheap international flights from India. No convenience fees, no markup, real WhatsApp alerts.',
    blurb: 'MakeMyTrip is India\'s largest OTA — a booking platform, not a deal intelligence service. When you book through MMT, you pay a convenience fee on top of the base fare, and MMT earns airline commissions. They\'re financially incentivised to fill seats profitably, not to surface the absolute cheapest fare. Their "deals" page is largely partner-sponsored promotions — not curated market lows. And if a flash sale drops a fare by 60% for 3 hours, you won\'t hear about it until the next morning\'s email.',
    theirWeaks: [
      'Charges ₹150–400+ convenience fee per international booking',
      'Earns airline and OTA commissions — financially motivated away from cheapest fares',
      '"Deals" are largely partner-sponsored promotions, not market lows',
      'No real-time WhatsApp alerts — time-sensitive fares disappear before you see them',
      'Cluttered UI with upsells: insurance, hotel add-ons, seat upgrades',
      'No human curation — deals are algorithmic promotions, not hand-picked savings',
      'Doesn\'t surface error fares or flash sales that vanish in hours',
      'Premium cabin "deals" are heavily marked up Business Class fares, not genuine savings',
    ],
  },
  skyscanner: {
    name: 'Skyscanner',
    tagline: 'YoloFare vs Skyscanner — The Difference Between Searching and Discovering',
    description: 'Skyscanner shows you every flight. YoloFare shows you the ones that are actually a steal — hand-curated deals 40%+ below average, with instant WhatsApp alerts before they disappear.',
    metaDesc: 'YoloFare vs Skyscanner for Indian travellers. Skyscanner searches, YoloFare curates. See why deal intelligence beats a search engine for saving money on flights.',
    blurb: 'Skyscanner is an exceptional flight search engine — but it\'s a search engine, not a deal intelligence service. It surfaces every fare in the market and lets you compare them. What it can\'t do is tell you "this fare is 55% cheaper than usual and will be gone in 6 hours — book now." That editorial layer, the human judgment of what\'s genuinely worth your time, is what YoloFare provides. Skyscanner also redirects you to OTAs for booking, where convenience fees get added back into the price.',
    theirWeaks: [
      'A search tool, not a curation service — no "this is a genuine deal" intelligence layer',
      'Redirects to OTAs for booking, where service fees are added',
      'Price alerts are email-based — not instant enough for time-sensitive fares',
      'No WhatsApp notifications for flash sales or error fares',
      'Overwhelming results — thousands of options with no guidance on what\'s actually worth it',
      'No coverage of Business or First Class deals specifically',
      'Not optimised for Indian departure cities and Indian traveller preferences',
      'Misses error fares that are manually spotted and last only hours',
    ],
  },
  'google-flights': {
    name: 'Google Flights',
    tagline: 'YoloFare vs Google Flights — Great for Searching, Not for Deal Discovery',
    description: 'Google Flights is the best flight search tool in the world. But it\'s a search tool. YoloFare is a deal intelligence service — we tell you when a fare is a genuine steal and alert you on WhatsApp before it\'s gone.',
    metaDesc: 'YoloFare vs Google Flights: Why you need both. Google Flights searches fares; YoloFare tells you which ones are genuinely cheap. Real-time WhatsApp alerts for Indian travellers.',
    blurb: 'Google Flights is arguably the world\'s best flight search interface — the price calendar, flexible date search, and price graph are genuinely excellent. But Google Flights is a neutral search engine. It shows you all fares without editorial judgment on what\'s a steal. It doesn\'t know that a particular London fare is 58% below its 3-year average, or that it will last only 4 hours before the airline corrects it. YoloFare provides exactly that layer: human curation, context, and instant WhatsApp alerts so you can act before the fare disappears.',
    theirWeaks: [
      'A search engine — shows all fares with no editorial "this is a deal" layer',
      'No alert system that can match the urgency of time-sensitive fares',
      'Price tracking emails often arrive after the cheapest fares are gone',
      'No WhatsApp alerts for instant notification',
      'Redirects to airlines and OTAs for booking — no seamless booking with deal context',
      'No Business or First Class deal curation',
      'Global tool with no specific focus on Indian departure city deals',
      'Misses hand-spotted error fares that exist only for hours',
    ],
  },
  cleartrip: {
    name: 'Cleartrip',
    tagline: 'YoloFare vs Cleartrip — Booking Platform vs Deal Intelligence',
    description: 'Cleartrip books flights and takes a cut. YoloFare finds the market\'s cheapest fares without adding fees or commissions — just clean deal alerts straight to your WhatsApp.',
    metaDesc: 'YoloFare vs Cleartrip for international flights from India. Why a no-middleman deal alert service beats an OTA. No service fees, no markup, instant WhatsApp alerts.',
    blurb: 'Cleartrip is a clean, well-designed OTA — but it\'s still an OTA. It earns from convenience fees and airline commissions, and its "deals" are driven by airline partnerships rather than independent fare monitoring. Cleartrip does what all OTAs do: it adds a layer between you and the cheapest fare. YoloFare removes that layer entirely. We monitor fares independently, earn from subscriptions (not bookings), and have no financial reason to steer you toward a pricier option.',
    theirWeaks: [
      'OTA model with convenience fees layered on top of base fares',
      'Earns airline commissions — not financially neutral when surfacing "deals"',
      'Deal promotions are largely airline-partnership driven, not independently curated',
      'No real-time WhatsApp alerts for time-sensitive fares',
      'No Business or First Class deal curation',
      'You must actively check the app — no proactive deal discovery',
      'No human curation layer for error fares or flash sales',
      'International flight focus is secondary to domestic in their deal coverage',
    ],
  },
  ixigo: {
    name: 'Ixigo',
    tagline: 'YoloFare vs Ixigo — Beyond Price Comparison to Real Deal Intelligence',
    description: 'Ixigo compares prices and earns from bookings. YoloFare operates differently — subscription-funded, human-curated deals with instant WhatsApp alerts and zero booking commissions in our pricing.',
    metaDesc: 'YoloFare vs Ixigo for cheap international flights from India. No convenience fees, no ad clutter, WhatsApp alerts — see the difference between an aggregator and a deal service.',
    blurb: 'Ixigo is a popular Indian travel aggregator with a strong domestic focus, useful price tracking, and a large user base. But Ixigo is built around the aggregator-OTA model: it earns when you book through its platform, which means its deal recommendations are filtered through a commercial lens. The interface is ad-heavy, the "deals" page mixes genuine fares with sponsored listings, and international deal coverage is limited compared to a dedicated international deal service.',
    theirWeaks: [
      'Aggregator model with booking commissions embedded in recommendations',
      'Ad-heavy interface — sponsored listings mixed in with organic fares',
      'Strong on domestic flights, limited focus on international deal curation',
      'No WhatsApp alerts — relies on app notifications and email',
      'No Business or First Class international deal coverage',
      'No human editorial layer — purely algorithmic deal surfacing',
      'Doesn\'t cover error fares or manually spotted flash sales',
      'Convenience fees added on OTA-redirected bookings',
    ],
  },
  easemytrip: {
    name: 'EaseMyTrip',
    tagline: 'YoloFare vs EaseMyTrip — The Real Cost of "No Convenience Fee"',
    description: 'EaseMyTrip made headlines for no convenience fees — but it\'s still an OTA earning airline commissions. YoloFare earns from subscriptions, not bookings, giving you genuinely unbiased deal intelligence.',
    metaDesc: 'YoloFare vs EaseMyTrip for international flights from India. Beyond the no-fee headline — why a subscription deal service gives you better fares and instant WhatsApp alerts.',
    blurb: 'EaseMyTrip built its brand around the "no convenience fee" positioning — a genuine differentiator in the Indian OTA market. But removing the convenience fee doesn\'t remove the fundamental OTA dynamic: EaseMyTrip still earns airline GDS commissions, incentive payouts, and promotional fees. Its "deal" promotions are typically airline-partnership campaigns. And critically, it\'s a booking platform — not a service that proactively hunts for the cheapest fares in the market and pushes them to you the moment they appear.',
    theirWeaks: [
      'Still earns airline GDS commissions and incentives — not truly commission-free',
      '"Deals" are airline-partnership promotions, not independent fare monitoring',
      'No proactive deal discovery — you have to search, not be alerted',
      'No WhatsApp alerts for instant notification of time-sensitive fares',
      'No Business or First Class deal curation',
      'International deal coverage is secondary to domestic focus',
      'No human curation — misses error fares and manually spotted flash sales',
      'Booking interface adds friction vs. going direct to the airline',
    ],
  },
  kayak: {
    name: 'Kayak',
    tagline: 'YoloFare vs Kayak — Why a US-Built Aggregator Misses India-Specific Deals',
    description: 'Kayak searches global fares and redirects to OTAs. YoloFare is built specifically for Indian travellers — curating deals from Delhi, Mumbai, Bangalore, Hyderabad and Chennai with WhatsApp alerts.',
    metaDesc: 'YoloFare vs Kayak for Indian travellers. Why a global aggregator misses India-specific deals — and why real-time WhatsApp alerts beat OTA redirect price comparison.',
    blurb: 'Kayak is one of the world\'s leading flight search aggregators — powerful, fast, and feature-rich. But it\'s built for a global audience, primarily the US and European markets. India-specific fare patterns, the best departure city combinations, deals on routes that Indian travellers love (Thailand, UAE, UK, Bali, Japan), and the nuances of Indian airline pricing are not Kayak\'s core competency. And like Skyscanner, Kayak is a search tool — it surfaces fares but doesn\'t curate them. There\'s no "this is 50% below average — book today" intelligence layer.',
    theirWeaks: [
      'Built for global (primarily US/European) travellers — not optimised for Indian departures',
      'A search/comparison tool, not a deal curation service',
      'Redirects to OTAs for booking — convenience fees added downstream',
      'Price alerts are email-based, not instant WhatsApp notifications',
      'No Business or First Class deal curation for Indian routes',
      'No editorial layer to identify genuine steals vs. normal fares',
      'Misses India-specific error fares and flash sales on Indian routes',
      'Limited insight into Indian departure city-specific fare patterns',
    ],
  },
  zomunk: {
    name: 'Zomunk',
    tagline: 'YoloFare vs Zomunk — Which Flight Deal Service Is Actually Worth It?',
    description: 'Zomunk sends flight deal emails to subscribers. YoloFare goes further — no agency markups, WhatsApp alerts, and deals across Economy, Business & First Class from 5 Indian cities.',
    metaDesc: 'Comparing YoloFare vs Zomunk for Indian flight deals. See why YoloFare\'s no-middleman approach gets you cheaper fares with real-time WhatsApp alerts.',
    blurb: 'Zomunk aggregates deals from airlines and OTAs and sends them via email newsletters. Like most deal aggregators, the prices you see often have affiliate commissions or OTA markups baked in — meaning you\'re not always seeing the true cheapest fare.',
    theirWeaks: [
      'Deals often sourced through affiliate OTA links (commission added)',
      'Email-only alerts — easy to miss time-sensitive deals',
      'Limited to select departure cities',
      'No business or premium cabin deals',
      'No personalisation based on your preferred routes',
    ],
  },
  happyfares: {
    name: 'HappyFares',
    tagline: 'YoloFare vs HappyFares — The Honest Comparison for Indian Travelers',
    description: 'HappyFares shows flight prices across OTAs. YoloFare is different — we source deals directly, cut out the agencies, and alert you on WhatsApp the moment a deal drops.',
    metaDesc: 'YoloFare vs HappyFares: Which is better for finding cheap international flights from India? We break down pricing transparency, alerts, and deal quality.',
    blurb: 'HappyFares aggregates prices from multiple OTAs and travel agencies. It\'s a comparison tool at heart — which means every price you click through to has an intermediary taking a cut. You\'re comparison-shopping across middlemen, not going direct.',
    theirWeaks: [
      'Prices shown include OTA and agency markups',
      'You\'re clicking through to third parties — not booking direct',
      'Alert system requires checking the app or email',
      'No curated "this is genuinely a steal" editorial layer',
      'No WhatsApp alerts for instant notification',
    ],
  },
  wowfare: {
    name: 'WowFare',
    tagline: 'YoloFare vs WowFare — Why Indian Travelers Are Switching',
    description: 'WowFare promotes flight deals online. YoloFare\'s edge is zero middlemen, hand-verified pricing, and real-time WhatsApp alerts — so you book before the deal disappears.',
    metaDesc: 'YoloFare vs WowFare for cheap international flights from India. Compare deal quality, alert speed, pricing transparency and why no-middleman matters.',
    blurb: 'WowFare promotes flight deals primarily via social media and email. Deals are often sourced through affiliate links to OTAs, and the team acts as a content layer between you and the actual booking — adding friction and sometimes cost.',
    theirWeaks: [
      'Social-media-first approach means deals aren\'t always verified before posting',
      'Affiliate OTA links mean prices may be higher than going direct',
      'No structured alert system — you rely on seeing their post',
      'No Business or First Class deal coverage',
      'Inconsistent update frequency',
    ],
  },
  sastafare: {
    name: 'SastaFare',
    tagline: 'YoloFare vs SastaFare — Beyond "Cheap": Getting the Best Real Fare',
    description: '"Sasta" means cheap — but cheap via an agency is still expensive. YoloFare eliminates intermediaries entirely so you get the lowest possible fare, not the lowest after commissions.',
    metaDesc: 'YoloFare vs SastaFare: Comparing international flight deal services for Indian travellers. See why cutting out middlemen makes YoloFare the smarter choice.',
    blurb: 'SastaFare focuses on budget-friendly fares but operates primarily through comparison and affiliate models. The deals look cheap on the surface — but when OTA commissions and agency fees are factored in, you\'re often not getting the rock-bottom price that a direct approach would yield.',
    theirWeaks: [
      'Budget-only focus misses massive savings on Business and Premium Economy',
      'Affiliate and OTA model means commission is embedded in pricing',
      'Email and web alerts — not instant enough for time-sensitive fares',
      'Limited departure city coverage',
      'No human curation — algorithmic aggregation misses true error fares',
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(COMPETITORS).map(c => ({ competitor: c }))
}


export async function generateMetadata({ params }) {
  const { competitor } = await params
  const data = COMPETITORS[competitor]
  if (!data) return { title: 'Not Found' }
  return {
    title: data.tagline,
    description: data.metaDesc,
    alternates: { canonical: `https://www.yolofare.com/vs/${competitor}` },
    openGraph: {
      title: data.tagline,
      description: data.metaDesc,
      url: `https://www.yolofare.com/vs/${competitor}`,
      siteName: 'YoloFare',
      type: 'website',
    },
  }
}

const CHECK = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
    <circle cx="10" cy="10" r="10" fill="#22c55e"/>
    <path d="M5.5 10l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CROSS = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
    <circle cx="10" cy="10" r="10" fill="#ef4444"/>
    <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const FEATURES = [
  { label: 'No middlemen — deals sourced directly',       yolo: true,  them: false },
  { label: 'Zero agency or OTA commissions in pricing',    yolo: true,  them: false },
  { label: 'Real-time WhatsApp alerts',                    yolo: true,  them: false },
  { label: 'Covers all 5 major Indian departure cities',   yolo: true,  them: false },
  { label: 'Economy, Business & First Class deals',        yolo: true,  them: false },
  { label: 'Hand-curated by a human — not algorithm',      yolo: true,  them: false },
  { label: 'Transparent was/now pricing shown upfront',    yolo: true,  them: false },
  { label: 'Verified deals before publishing',             yolo: true,  them: false },
]

export default async function ComparisonPage({ params }) {
  const { competitor } = await params
  const data = COMPETITORS[competitor]

  if (!data) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p>Page not found. <Link href="/">Go home</Link></p>
      </div>
    )
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is YoloFare better than ${data.name} for international flight deals from India?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `YoloFare sources deals directly without going through agencies or OTAs, which means no commission markups. Unlike ${data.name}, YoloFare also sends real-time WhatsApp alerts and covers Business and First Class deals alongside Economy.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does YoloFare charge more than ${data.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `YoloFare's Pro plan is ₹999/month with no hidden agency fees built into the flight prices. Because we cut out middlemen, the fares you see are the actual market fares — not inflated by commissions.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which cities does YoloFare cover compared to ${data.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `YoloFare covers deals departing from Delhi, Mumbai, Bangalore, Hyderabad, and Chennai — all 5 major Indian aviation hubs.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div style={{fontFamily:"'DM Sans', system-ui, sans-serif", color:'#1a1a1a', background:'#fff'}}>

        {/* Nav */}
        <nav style={{borderBottom:'1px solid #f0f0f0', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#fff', zIndex:10}}>
          <Link href="/" style={{fontFamily:'Syne, sans-serif', fontSize:20, fontWeight:800, textDecoration:'none', color:'#1a1a1a'}}>
            Yolo<span style={{color:'#FF5C3A'}}>Fare</span>
          </Link>
          <Link href="/deals" style={{background:'#FF5C3A', color:'#fff', padding:'8px 20px', borderRadius:100, fontSize:14, fontWeight:600, textDecoration:'none'}}>
            See Deals →
          </Link>
        </nav>

        {/* Hero */}
        <section style={{background:'linear-gradient(135deg, #fff8f6 0%, #fff 60%)', padding:'64px 24px 56px', textAlign:'center', borderBottom:'1px solid #f5e8e4'}}>
          <div style={{display:'inline-block', background:'#fff4f1', border:'1px solid #ffd5c8', borderRadius:100, padding:'6px 16px', fontSize:13, color:'#FF5C3A', fontWeight:600, marginBottom:20}}>
            YoloFare vs {data.name}
          </div>
          <h1 style={{fontFamily:'Syne, sans-serif', fontSize:'clamp(26px, 4vw, 44px)', fontWeight:800, maxWidth:760, margin:'0 auto 20px', lineHeight:1.2, color:'#111'}}>
            {data.tagline}
          </h1>
          <p style={{fontSize:17, color:'#555', maxWidth:620, margin:'0 auto 36px', lineHeight:1.7}}>
            {data.description}
          </p>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <Link href="/deals" style={{background:'#FF5C3A', color:'#fff', padding:'14px 28px', borderRadius:100, fontWeight:700, fontSize:15, textDecoration:'none'}}>
              View Free Deals →
            </Link>
            <Link href="/pricing" style={{background:'#fff', color:'#FF5C3A', padding:'14px 28px', borderRadius:100, fontWeight:700, fontSize:15, textDecoration:'none', border:'2px solid #FF5C3A'}}>
              See Pro Plan
            </Link>
          </div>
        </section>

        <div style={{maxWidth:860, margin:'0 auto', padding:'0 24px'}}>

          {/* The problem with them */}
          <section style={{padding:'56px 0 40px'}}>
            <h2 style={{fontFamily:'Syne, sans-serif', fontSize:26, fontWeight:800, marginBottom:16, color:'#111'}}>
              The Problem with {data.name}
            </h2>
            <p style={{fontSize:16, color:'#555', lineHeight:1.8, marginBottom:24}}>
              {data.blurb}
            </p>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12}}>
              {data.theirWeaks.map((w, i) => (
                <li key={i} style={{display:'flex', alignItems:'flex-start', gap:12, background:'#fff5f5', border:'1px solid #fde0e0', borderRadius:12, padding:'14px 18px', fontSize:15, color:'#444'}}>
                  <span style={{color:'#ef4444', fontSize:18, flexShrink:0, marginTop:1}}>✕</span>
                  {w}
                </li>
              ))}
            </ul>
          </section>

          {/* The YoloFare difference */}
          <section style={{padding:'16px 0 40px'}}>
            <h2 style={{fontFamily:'Syne, sans-serif', fontSize:26, fontWeight:800, marginBottom:16, color:'#111'}}>
              The YoloFare Difference: Zero Middlemen
            </h2>
            <p style={{fontSize:16, color:'#555', lineHeight:1.8, marginBottom:32}}>
              Most flight deal services are built on affiliate relationships — they earn a commission every time you book through their link.
              That commission comes from somewhere: the airline charges the OTA more, the OTA charges you more, and the deal site takes its cut.
              <strong style={{color:'#111'}}> You're paying for a chain of intermediaries.</strong>
            </p>
            <p style={{fontSize:16, color:'#555', lineHeight:1.8, marginBottom:32}}>
              YoloFare is different. We're a <strong style={{color:'#111'}}>subscription-based deal intelligence service</strong> — not an affiliate operation.
              We make money from your ₹999/month subscription, not from commissions on your bookings.
              That means every deal we surface is genuinely the cheapest fare we could find — not the cheapest fare that pays us the most.
            </p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:20}}>
              {[
                { icon:'🚫', title:'No Agency Fees', desc:'We don\'t charge airlines or OTAs for listing their deals. Zero commissions embedded in pricing.' },
                { icon:'⚡', title:'WhatsApp Alerts', desc:'Deals are time-sensitive. We alert you on WhatsApp the moment a fare drops — not hours later by email.' },
                { icon:'✈️', title:'All Cabin Classes', desc:'Economy, Premium Economy, Business & First Class. The best deals aren\'t always in Economy.' },
                { icon:'🇮🇳', title:'5 Indian Cities', desc:'Delhi, Mumbai, Bangalore, Hyderabad, Chennai. Wherever you fly from, we\'ve got you covered.' },
                { icon:'👁️', title:'Human Curated', desc:'Every deal is hand-verified by our team before it goes live. No algorithmic noise.' },
                { icon:'💯', title:'Transparent Pricing', desc:'We always show was/now pricing with real savings percentages. No fake "sale" prices.' },
              ].map((card, i) => (
                <div key={i} style={{border:'1px solid #f0f0f0', borderRadius:16, padding:'24px 20px', background:'#fafafa'}}>
                  <div style={{fontSize:28, marginBottom:10}}>{card.icon}</div>
                  <div style={{fontWeight:700, fontSize:15, color:'#111', marginBottom:6}}>{card.title}</div>
                  <div style={{fontSize:14, color:'#666', lineHeight:1.6}}>{card.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section style={{padding:'16px 0 56px'}}>
            <h2 style={{fontFamily:'Syne, sans-serif', fontSize:26, fontWeight:800, marginBottom:28, color:'#111'}}>
              Feature Comparison
            </h2>
            <div style={{border:'1px solid #e8e8e8', borderRadius:16, overflow:'hidden'}}>
              {/* Header */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 140px 140px', background:'#f8f8f8', borderBottom:'1px solid #e8e8e8'}}>
                <div style={{padding:'16px 20px', fontWeight:700, fontSize:14, color:'#666'}}>Feature</div>
                <div style={{padding:'16px 20px', fontWeight:800, fontSize:14, color:'#FF5C3A', textAlign:'center', background:'#fff8f6', borderLeft:'1px solid #e8e8e8'}}>YoloFare</div>
                <div style={{padding:'16px 20px', fontWeight:700, fontSize:14, color:'#888', textAlign:'center', borderLeft:'1px solid #e8e8e8'}}>{data.name}</div>
              </div>
              {FEATURES.map((f, i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 140px 140px', borderTop: i > 0 ? '1px solid #f0f0f0' : undefined, background: i % 2 === 0 ? '#fff' : '#fafafa'}}>
                  <div style={{padding:'16px 20px', fontSize:15, color:'#333', display:'flex', alignItems:'center'}}>{f.label}</div>
                  <div style={{padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff8f6', borderLeft:'1px solid #f0e8e4'}}>
                    {f.yolo ? <CHECK /> : <CROSS />}
                  </div>
                  <div style={{padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'center', borderLeft:'1px solid #f0f0f0'}}>
                    {f.them ? <CHECK /> : <CROSS />}
                  </div>
                </div>
              ))}
            </div>
            <p style={{fontSize:12, color:'#aaa', marginTop:12}}>
              * Competitor feature assessment based on publicly available information. Accurate as of 2026.
            </p>
          </section>

          {/* FAQ */}
          <section style={{padding:'0 0 56px'}}>
            <h2 style={{fontFamily:'Syne, sans-serif', fontSize:26, fontWeight:800, marginBottom:28, color:'#111'}}>
              Frequently Asked Questions
            </h2>
            {[
              {
                q: `Why is YoloFare cheaper than ${data.name}?`,
                a: `${data.name} and similar services typically earn affiliate commissions when you book through their links — those commissions are factored into the prices you see. YoloFare earns from subscriptions (₹999/month), not commissions, so we have zero incentive to point you toward a pricier fare. The deals we share are the actual cheapest fares we found.`,
              },
              {
                q: 'Do I need a Pro subscription to see deals?',
                a: 'No — YoloFare offers 3 free South East Asia deals without any account. The Pro plan (₹999/month) unlocks all 15+ deals across every region, plus real-time WhatsApp alerts so you never miss a time-sensitive fare.',
              },
              {
                q: 'How does YoloFare find its deals?',
                a: 'Our team monitors airline pricing daily across Google Flights, airline websites, and ITA Matrix. When we spot a fare that\'s 40%+ below the historical average, we hand-verify it and publish it within minutes. No algorithms, no automated scraping — human eyes on every deal.',
              },
              {
                q: `Can I use both YoloFare and ${data.name}?`,
                a: `Absolutely. But most of our Pro subscribers find they stop needing other services — because YoloFare's deals are deeper, arrive faster on WhatsApp, and cover more cabin classes and departure cities than most alternatives.`,
              },
            ].map((faq, i) => (
              <div key={i} style={{borderBottom:'1px solid #f0f0f0', padding:'24px 0'}}>
                <h3 style={{fontFamily:'Syne, sans-serif', fontSize:17, fontWeight:700, marginBottom:10, color:'#111'}}>{faq.q}</h3>
                <p style={{fontSize:15, color:'#555', lineHeight:1.8, margin:0}}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* CTA */}
          <section style={{background:'linear-gradient(135deg, #0D0A08 0%, #1a1208 100%)', borderRadius:24, padding:'48px 32px', textAlign:'center', marginBottom:64}}>
            <h2 style={{fontFamily:'Syne, sans-serif', fontSize:28, fontWeight:800, color:'#FFF5EC', marginBottom:12}}>
              Stop paying middlemen. Start saving real money.
            </h2>
            <p style={{color:'rgba(255,245,236,0.6)', fontSize:16, marginBottom:32, maxWidth:480, margin:'0 auto 32px'}}>
              Join thousands of Indian travellers getting direct, curated international flight deals — with zero agency commissions.
            </p>
            <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
              <Link href="/deals" style={{background:'#FF5C3A', color:'#fff', padding:'14px 28px', borderRadius:100, fontWeight:700, fontSize:15, textDecoration:'none'}}>
                Browse Free Deals →
              </Link>
              <Link href="/pricing" style={{background:'transparent', color:'#FFF5EC', padding:'14px 28px', borderRadius:100, fontWeight:600, fontSize:15, textDecoration:'none', border:'1px solid rgba(255,245,236,0.25)'}}>
                Get Pro — ₹999/mo
              </Link>
            </div>
          </section>

          {/* Internal links to other comparisons */}
          <section style={{paddingBottom:64}}>
            <h3 style={{fontFamily:'Syne, sans-serif', fontSize:18, fontWeight:700, marginBottom:16, color:'#111'}}>
              More Comparisons
            </h3>
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              {Object.entries(COMPETITORS)
                .filter(([key]) => key !== competitor)
                .map(([key, comp]) => (
                  <Link key={key} href={`/vs/${key}`} style={{background:'#f5f5f5', color:'#444', padding:'8px 18px', borderRadius:100, fontSize:14, fontWeight:500, textDecoration:'none', border:'1px solid #e8e8e8'}}>
                    YoloFare vs {comp.name} →
                  </Link>
                ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer style={{borderTop:'1px solid #f0f0f0', padding:'24px', textAlign:'center', fontSize:13, color:'#aaa'}}>
          <Link href="/" style={{fontFamily:'Syne, sans-serif', fontWeight:800, color:'#1a1a1a', textDecoration:'none', marginRight:24}}>
            Yolo<span style={{color:'#FF5C3A'}}>Fare</span>
          </Link>
          <Link href="/deals" style={{color:'#aaa', textDecoration:'none', marginRight:16}}>Deals</Link>
          <Link href="/pricing" style={{color:'#aaa', textDecoration:'none', marginRight:16}}>Pricing</Link>
          <Link href="/login" style={{color:'#aaa', textDecoration:'none'}}>Sign In</Link>
          <p style={{marginTop:12}}>© 2026 YoloFare. All rights reserved.</p>
        </footer>

      </div>
    </>
  )
}

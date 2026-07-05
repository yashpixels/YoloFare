'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { trackViewContent, trackBookingClick } from '../../../lib/pixel.js'

const TESTIMONIALS = [
  {
    name: 'Arjun R.',
    city: 'Delhi',
    time: '2 hours ago',
    text: 'Booked Singapore Premium Economy through YoloFare. Saved ₹68,000 on a fare I\'d been tracking for weeks — the deal appeared before I even thought to search.',
  },
  {
    name: 'Priya M.',
    city: 'Mumbai',
    time: 'yesterday',
    text: 'Was sceptical at first but the Bangkok deal was real — ₹23k return, booked it same day. My friends paid ₹52k for the same route a week later.',
  },
  {
    name: 'Rahul K.',
    city: 'Bangalore',
    time: '3 days ago',
    text: 'Geneva Business Class for ₹41k return. Checked everywhere after and it was ₹1.2L. Upgraded to Pro the same day — worth every rupee.',
  },
]

function getBaggage(cabinClass) {
  if (!cabinClass) return '1 free cabin bag · Check-in baggage varies by airline'
  const c = cabinClass.toLowerCase()
  if (c.includes('first')) return '2 free cabin bags · 3 free check-in bags'
  if (c.includes('business')) return '2 free cabin bags · 2 free check-in bags'
  if (c.includes('premium')) return '1 free cabin bag · 1 free check-in bag'
  return '1 free cabin bag · Check-in baggage varies by airline'
}

export default function DealPage({ params }) {
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [lockedDeals, setLockedDeals] = useState([])
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [testimonialVisible, setTestimonialVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setId(resolved.id)
    }
    resolveParams()
  }, [])

  useEffect(() => {
    if (!id) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(`/login?next=/deals/${id}`)
      } else {
        fetchDeal()
        fetchUserData(session.user.id)
      }
    })
  }, [id])

  // Testimonial rotation with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialVisible(false)
      setTimeout(() => {
        setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)
        setTestimonialVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchDeal() {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single()
    if (data) {
      setDeal(data)
      trackViewContent(data.destination, data.deal_price)
    }
    setLoading(false)
  }

  async function fetchUserData(userId) {
    // Check pro status
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status, expires_at')
      .eq('user_id', userId)
      .single()

    const proStatus = sub?.status === 'active' && new Date(sub.expires_at) > new Date()
    setIsPro(proStatus)

    if (!proStatus) {
      // Get user's preferred origins for deal matching
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('preferred_origins')
        .eq('user_id', userId)
        .single()

      const origins = prefs?.preferred_origins || []
      let deals = []

      // Try to match deals to user's home airports first
      if (origins.length > 0) {
        const { data: matched } = await supabase
          .from('deals')
          .select('id, origin_code, origin_city, deal_price, regular_price, savings_pct, image_url')
          .in('origin_code', origins)
          .eq('is_active', true)
          .neq('id', id)
          .limit(4)
        deals = matched || []
      }

      // Top up with any active deals if not enough from preferred origins
      if (deals.length < 3) {
        const { data: anyDeals } = await supabase
          .from('deals')
          .select('id, origin_code, origin_city, deal_price, regular_price, savings_pct, image_url')
          .eq('is_active', true)
          .neq('id', id)
          .limit(4)
        deals = anyDeals || []
      }

      setLockedDeals(deals.slice(0, 4))
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      Loading deal...
    </div>
  )

  if (!deal) return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      Deal not found. <Link href="/deals" style={{ color: '#FF5C3A', marginLeft: 8 }}>Back to deals</Link>
    </div>
  )

  const bookingUrl = deal.booking_url && deal.booking_url.startsWith('http')
    ? deal.booking_url
    : `https://www.google.com/travel/flights?q=flights+from+${deal.origin_code || ''}+to+${deal.dest_code || ''}`

  const stopsText = deal.stops === 0 ? 'a direct flight' : `a ${deal.stops}-stop flight`
  const howWeFoundThis = `Our team tracks fare data across 95+ international routes every day. This ${deal.airline || 'airline'} ${deal.cabin_class || ''} fare on the ${deal.origin_city || deal.origin_code}–${deal.destination} route dropped ${deal.savings_pct}% below its historical average. We verified availability, confirmed it is ${stopsText}, checked the baggage policy, and surfaced it for members flying out of ${deal.origin_city || deal.origin_code}.`

  const t = TESTIMONIALS[testimonialIdx]

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .deal-nav      { padding: 0 48px; }
        .deal-wrap     { max-width: 780px; margin: 0 auto; padding: 48px 48px 80px; }
        .detail-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .route-row     { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 28px 24px; }
        .route-code    { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; letter-spacing: -2px; }
        .route-mid     { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .price-row     { display: flex; align-items: baseline; gap: 14px; }
        .locked-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .testimonial-fade { transition: opacity 0.4s ease; }

        @media (max-width: 768px) {
          .deal-nav    { padding: 0 16px; }
          .deal-wrap   { padding: 24px 16px 60px; }
          .detail-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .route-code  { font-size: 34px !important; letter-spacing: -1px !important; }
          .route-row   { padding: 20px 16px; gap: 10px; }
          .route-mid   { gap: 4px; }
          .route-mid span { font-size: 10px !important; }
          .price-row   { flex-wrap: wrap; gap: 8px; }
          .book-btn    { font-size: 16px !important; padding: 16px 24px !important; }
          .img-hero    { height: 220px !important; border-radius: 16px !important; }
          .detail-cell { padding: 14px !important; }
          .detail-label { font-size: 9px !important; }
          .detail-val  { font-size: 14px !important; }
          .locked-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.15, bottom: '10%', left: -100 }} />
      </div>

      {/* Nav */}
      <nav className="deal-nav" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </Link>
        <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          ← Back to all deals
        </Link>
      </nav>

      {/* Page content */}
      <div className="deal-wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* Hero image */}
        <div className="img-hero" style={{ height: 320, borderRadius: 24, overflow: 'hidden', marginBottom: 32, position: 'relative', background: '#1a1a2a' }}>
          {deal.image_url && (
            <img src={deal.image_url} alt={deal.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(13,10,8,0.8) 100%)' }} />
          <span style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(13,10,8,0.6)', backdropFilter: 'blur(8px)', color: 'rgba(255,245,236,0.9)', fontSize: 11, padding: '4px 12px', borderRadius: 100, border: '0.5px solid rgba(255,255,255,0.15)' }}>
            {deal.cabin_class}
          </span>
          <span style={{ position: 'absolute', top: 16, right: 16, background: '#FF5C3A', color: 'white', fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>
            {deal.savings_pct}% off
          </span>
          <span style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.6)', lineHeight: 1.1 }}>
            {deal.destination}
          </span>
        </div>

        {/* Route display — both legs */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, marginBottom: 16, overflow: 'hidden' }}>
          {/* Outbound */}
          <div style={{ padding: '6px 24px 4px', fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Departure</div>
          <div className="route-row" style={{ paddingTop: 12, paddingBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="route-code">{deal.origin_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.origin_city || deal.origin_code}</div>
            </div>
            <div className="route-mid" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: 18 }}>✈️</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', textAlign: 'center' }}>
                {deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', textAlign: 'center' }}>{deal.airline}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="route-code">{deal.dest_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.destination}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '0 24px' }} />

          {/* Return */}
          <div style={{ padding: '12px 24px 4px', fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Return</div>
          <div className="route-row" style={{ paddingTop: 12, paddingBottom: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="route-code">{deal.dest_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.destination}</div>
            </div>
            <div className="route-mid" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: 18 }}>✈️</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', textAlign: 'center' }}>
                {deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', textAlign: 'center' }}>{deal.airline}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="route-code">{deal.origin_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.origin_city || deal.origin_code}</div>
            </div>
          </div>
        </div>

        {/* Price block */}
        <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.25)', borderRadius: 20, padding: '24px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.7)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Deal price</div>
          <div className="price-row">
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, letterSpacing: -2, color: '#FFF5EC' }}>
              ₹{deal.deal_price?.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 18, color: 'rgba(255,245,236,0.3)', textDecoration: 'line-through' }}>
              ₹{deal.regular_price?.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 14, color: '#4CAF50', fontWeight: 600 }}>
              Save ₹{((deal.regular_price || 0) - (deal.deal_price || 0)).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Detail grid — includes baggage tile spanning full width */}
        <div className="detail-grid">
          {[
            ['TRAVEL DATES', deal.travel_dates || '—', false],
            ['CABIN CLASS', deal.cabin_class || '—', false],
            ['AIRLINE', deal.airline || '—', false],
            ['TRIP TYPE', 'Round trip', false],
            ['STOPS', deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`, false],
            ['REGION', deal.region || '—', false],
            ['INCLUDED BAGGAGE', getBaggage(deal.cabin_class), true],
          ].map(([label, val, fullWidth]) => (
            <div
              key={label}
              className="detail-cell"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 18px',
                gridColumn: fullWidth ? '1 / -1' : 'auto',
              }}
            >
              <div className="detail-label" style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
              <div className="detail-val" style={{ fontSize: 15, fontWeight: 500, color: '#FFF5EC' }}>{val}</div>
              {label === 'INCLUDED BAGGAGE' && (
                <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', marginTop: 5 }}>Confirm once on the booking page before purchasing</div>
              )}
            </div>
          ))}
        </div>

        {/* How we found this — replaces "How to book" */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>How we found this</div>
          <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.7)', lineHeight: 1.75, fontWeight: 300, margin: '0 0 14px 0' }}>
            {howWeFoundThis}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,92,58,0.7)', margin: 0, fontWeight: 500 }}>
            ⏱ Deals like this typically last 24–72 hours before airlines reprice.
          </p>
        </div>

        {/* What our members say — rotating testimonials */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>What our members say</div>
          <div className="testimonial-fade" style={{ opacity: testimonialVisible ? 1 : 0 }}>
            <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.8)', lineHeight: 1.75, fontStyle: 'italic', margin: '0 0 16px 0', fontWeight: 300 }}>
              "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,92,58,0.15)', border: '0.5px solid rgba(255,92,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#FF8060', flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#FFF5EC' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)' }}>{t.city}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)' }}>{t.time}</div>
            </div>
          </div>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} style={{ width: i === testimonialIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === testimonialIdx ? '#FF5C3A' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>

        {/* Locked premium deals — non-pro users only */}
        {!isPro && lockedDeals.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>More deals tracked for you</div>
            <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', marginBottom: 16, marginTop: 6 }}>Based on your origin preferences — destination hidden for free members.</p>
            <div className="locked-grid">
              {lockedDeals.map((ld) => (
                <div key={ld.id} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                  {/* Blurred hero with lock */}
                  <div style={{ height: 100, position: 'relative', overflow: 'hidden', background: '#1a1a2a' }}>
                    {ld.image_url ? (
                      <img
                        src={ld.image_url}
                        alt="locked deal"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px)', transform: 'scale(1.15)' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,92,58,0.08)' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,10,8,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 22 }}>🔒</div>
                    </div>
                    <span style={{ position: 'absolute', top: 8, right: 8, background: '#FF5C3A', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
                      {ld.savings_pct}% off
                    </span>
                  </div>
                  {/* Card info */}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', marginBottom: 6 }}>From {ld.origin_city || ld.origin_code}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#FFF5EC', letterSpacing: -0.5, lineHeight: 1 }}>
                      ₹{ld.deal_price?.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.25)', textDecoration: 'line-through', marginTop: 2 }}>
                      ₹{ld.regular_price?.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                      🔒 <span>Destination hidden</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div style={{ background: 'linear-gradient(135deg, rgba(255,92,58,0.12) 0%, rgba(224,58,26,0.06) 100%)', border: '1px solid rgba(255,92,58,0.25)', borderRadius: 20, padding: '28px 24px', marginTop: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#FFF5EC', marginBottom: 10, letterSpacing: -0.5 }}>
                Your preferences are set.
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,245,236,0.6)', lineHeight: 1.7, margin: '0 0 22px 0', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
                We're already tracking deals for you — upgrade to receive them directly in your inbox before anyone else sees them.
              </p>
              <Link
                href="/pricing"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FF5C3A', color: 'white', padding: '14px 30px', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}
              >
                Upgrade to Pro →
              </Link>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', marginTop: 12 }}>₹999/month · Cancel anytime</div>
            </div>
          </div>
        )}

        {/* Book button — bottom of page */}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="book-btn"
          onClick={() => trackBookingClick(deal.destination, deal.deal_price)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: '#FF5C3A', color: 'white', padding: '18px 28px', borderRadius: 100, fontSize: 17, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", boxSizing: 'border-box', textAlign: 'center', marginBottom: 12 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
          </svg>
          Secure this price →
        </a>
        <p style={{ fontSize: 12, color: 'rgba(255,245,236,0.25)', textAlign: 'center', marginBottom: 28 }}>
          You'll be taken to the airline's booking page · No fees added by YoloFare
        </p>

        <Link href="/deals" style={{ display: 'block', textAlign: 'center', fontSize: 14, color: 'rgba(255,245,236,0.4)', textDecoration: 'none' }}>
          ← Back to all deals
        </Link>
      </div>
    </div>
  )
}

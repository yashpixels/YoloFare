'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { trackViewContent, trackBookingClick } from '../../../lib/pixel.js'

export default function DealPage({ params }) {
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState(null)

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setId(resolved.id)
    }
    resolveParams()
  }, [])

  useEffect(() => {
    if (id) fetchDeal()
  }, [id])

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

  // Build Google Flights URL from deal data
  const buildGoogleFlightsUrl = () => {
    if (deal.booking_url && deal.booking_url.startsWith('http')) return deal.booking_url
    // Fallback: construct a Google Flights search URL
    const origin = deal.origin_code || ''
    const dest = deal.dest_code || ''
    const date = deal.travel_dates ? deal.travel_dates.replace(/\s/g, '') : ''
    return `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${dest}`
  }

  const flightsUrl = buildGoogleFlightsUrl()

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .deal-nav     { padding: 0 48px; }
        .deal-wrap    { max-width: 780px; margin: 0 auto; padding: 48px 48px 80px; }
        .detail-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .route-row    { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 28px 24px; }
        .route-code   { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; letter-spacing: -2px; }
        .route-mid    { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .price-row    { display: flex; align-items: baseline; gap: 14px; }

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
        }
      `}</style>

      {/* Orbs */}
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

      {/* Content */}
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

        {/* Price + CTA — THE MAIN ACTION */}
        <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.25)', borderRadius: 20, padding: '24px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.7)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Deal price</div>
          <div className="price-row" style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
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

          {/* BOOK ON GOOGLE FLIGHTS BUTTON */}
          <a
            href={flightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="book-btn"
            onClick={() => trackBookingClick(deal.destination, deal.deal_price)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: '#FF5C3A', color: 'white', padding: '18px 28px', borderRadius: 100, fontSize: 17, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3, boxSizing: 'border-box', textAlign: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
            </svg>
            Book on Google Flights →
          </a>
          <p style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', textAlign: 'center', marginTop: 10 }}>
            Opens Google Flights · No markup · Book directly with airline
          </p>
        </div>

        {/* Route display */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, marginBottom: 16 }}>
          <div className="route-row">
            <div style={{ textAlign: 'center' }}>
              <div className="route-code" style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, letterSpacing: -2 }}>{deal.origin_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.origin_city || deal.origin_code}</div>
            </div>
            <div className="route-mid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
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
              <div className="route-code" style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, letterSpacing: -2 }}>{deal.dest_code}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{deal.destination}</div>
            </div>
          </div>
        </div>

        {/* Detail grid */}
        <div className="detail-grid">
          {[
            ['TRAVEL DATES', deal.travel_dates || '—'],
            ['CABIN CLASS', deal.cabin_class || '—'],
            ['AIRLINE', deal.airline || '—'],
            ['TRIP TYPE', 'Round trip'],
            ['STOPS', deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`],
            ['REGION', deal.region || '—'],
          ].map(([label, val]) => (
            <div key={label} className="detail-cell" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
              <div className="detail-label" style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
              <div className="detail-val" style={{ fontSize: 15, fontWeight: 500, color: '#FFF5EC' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* About */}
        {deal.description && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>About this deal</div>
            <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.7)', lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{deal.description}</p>
          </div>
        )}

        {/* How to book */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>How to book</div>
          {[
            'Click "Book on Google Flights" above',
            'Enter the exact travel dates shown above',
            'Select the airline shown and book directly',
            'Prices may vary slightly — act fast, deals expire!',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,92,58,0.15)', border: '0.5px solid rgba(255,92,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#FF8060', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.6)', lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA — repeated for convenience */}
        <a
          href={flightsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="book-btn"
          onClick={() => trackBookingClick(deal.destination, deal.deal_price)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: '#FF5C3A', color: 'white', padding: '18px 28px', borderRadius: 100, fontSize: 17, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", boxSizing: 'border-box', textAlign: 'center', marginBottom: 16 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
          </svg>
          Book on Google Flights →
        </a>

        <Link href="/deals" style={{ display: 'block', textAlign: 'center', fontSize: 14, color: 'rgba(255,245,236,0.4)', textDecoration: 'none' }}>
          ← Back to all deals
        </Link>
      </div>
    </div>
  )
}

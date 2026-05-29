'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

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
    if (data) setDeal(data)
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

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.15, bottom: '10%', left: -100 }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: 'rgba(13,10,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </Link>
        <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to all deals
        </Link>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero image */}
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 380, position: 'relative', marginBottom: 40 }}>
          {deal.image_url && <img src={deal.image_url} alt={deal.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(13,10,8,0.85) 100%)' }} />
          
          {/* Savings badge */}
          <div style={{ position: 'absolute', top: 20, right: 20, background: '#FF5C3A', color: 'white', fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 100, fontFamily: "'Syne', sans-serif" }}>
            {deal.savings_pct}% off
          </div>

          {/* Cabin class badge */}
          <div style={{ position: 'absolute', top: 20, left: 20, background: deal.cabin_class === 'First' ? 'rgba(255,92,58,0.3)' : deal.cabin_class === 'Business' ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.15)', color: deal.cabin_class === 'First' ? '#FFAA88' : deal.cabin_class === 'Business' ? '#FFD700' : 'white', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 100, border: '0.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            {deal.cabin_class}
          </div>

          {/* Destination name overlay */}
          <div style={{ position: 'absolute', bottom: 28, left: 28 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{deal.country}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, letterSpacing: -2, color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.5)', lineHeight: 1 }}>{deal.destination}</div>
          </div>
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Left — deal details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Description */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 24, backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>About this deal</div>
              <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.75)', lineHeight: 1.7, fontWeight: 300 }}>{deal.description}</p>
            </div>

            {/* Flight details */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 24, backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Flight details</div>
              
              {/* Route */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{deal.origin_code}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)' }}>{deal.origin_city}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 1 }}>{deal.stops === 0 ? 'DIRECT' : `${deal.stops} STOP`}</div>
                  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: '#FF5C3A' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)' }}>{deal.airline}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{deal.dest_code}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)' }}>{deal.destination}</div>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Travel dates', value: deal.travel_dates },
                  { label: 'Cabin class', value: deal.cabin_class },
                  { label: 'Airline', value: deal.airline },
                  { label: 'Trip type', value: 'Round trip' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to book */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 24, backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>How to book</div>
              {['Click "Book on Google Flights" below', 'Enter the exact travel dates shown above', 'Select the airline shown and book directly', 'Prices may vary slightly — act fast, deals expire!'].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,92,58,0.15)', border: '0.5px solid rgba(255,92,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#FF5C3A', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,245,236,0.65)', lineHeight: 1.5, paddingTop: 3 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — price card */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28, backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Deal price</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, letterSpacing: -2, marginBottom: 4 }}>₹{deal.deal_price.toLocaleString('en-IN')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span style={{ fontSize: 16, color: 'rgba(255,245,236,0.3)', textDecoration: 'line-through' }}>₹{deal.regular_price.toLocaleString('en-IN')}</span>
                <span style={{ background: 'rgba(255,92,58,0.15)', color: '#FF8060', fontSize: 13, padding: '3px 10px', borderRadius: 100, fontWeight: 500 }}>Save ₹{(deal.regular_price - deal.deal_price).toLocaleString('en-IN')}</span>
              </div>

              <a href={deal.booking_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FF5C3A', color: 'white', textAlign: 'center', padding: '16px 24px', borderRadius: 100, fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: "'Syne', sans-serif", marginBottom: 12, transition: 'all 0.2s' }}>
                Book on Google Flights →
              </a>

              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.3)', marginBottom: 20 }}>
                You'll be redirected to Google Flights
              </div>

              <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '✓', text: 'Verified deal' },
                  { icon: '✓', text: 'Baggage included' },
                  { icon: '✓', text: deal.stops === 0 ? 'Non-stop flight' : `${deal.stops} stop max` },
                  { icon: '✓', text: `${deal.cabin_class} class` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>
                    <span style={{ color: '#4CAF50', fontWeight: 700 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Deal expires warning */}
            <div style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 16, padding: '14px 18px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.7)' }}>Flash deal — prices can change within hours. Book fast!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
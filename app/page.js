'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeCity, setActiveCity] = useState('DEL')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cities = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA']
  const cityNames = { DEL: 'Delhi', BOM: 'Mumbai', BLR: 'Bangalore', HYD: 'Hyderabad', MAA: 'Chennai' }

  const sampleDeals = [
    { from: 'DEL', dest: 'Singapore', flag: '🇸🇬', price: 14200, was: 38000, off: 63, airline: 'IndiGo', type: 'Economy', stops: 0 },
    { from: 'BOM', dest: 'Bangkok', flag: '🇹🇭', price: 11800, was: 29000, off: 59, airline: 'Air Asia', type: 'Economy', stops: 0 },
    { from: 'BLR', dest: 'London', flag: '🇬🇧', price: 42500, was: 98000, off: 57, airline: 'Air India', type: 'Business', stops: 1 },
    { from: 'DEL', dest: 'Tokyo', flag: '🇯🇵', price: 28900, was: 72000, off: 60, airline: 'Vistara', type: 'Economy', stops: 1 },
    { from: 'HYD', dest: 'Dubai', flag: '🇦🇪', price: 9400, was: 24000, off: 61, airline: 'IndiGo', type: 'Economy', stops: 0 },
    { from: 'MAA', dest: 'Bali', flag: '🇮🇩', price: 13600, was: 34000, off: 60, airline: 'Air India', type: 'Economy', stops: 1 },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .deal-card:hover { transform: translateY(-6px); border-color: rgba(255,92,58,0.4) !important; }
        .deal-card { transition: transform 0.25s, border-color 0.25s; }
        .nav-link:hover { color: #FFF5EC !important; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.18, top: -200, right: -150 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.13, bottom: '20%', left: -150 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #FF8C5A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.07, top: '60%', left: '45%' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: scrolled ? 'rgba(13,10,8,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.08)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800 }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#how-it-works" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>How it works</a>
          <a href="#destinations" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Destinations</a>
          <a href="#pricing" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
          <Link href="/login" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Login</Link>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '9px 22px', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>Browse deals →</Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,92,58,0.1)', border: '0.5px solid rgba(255,92,58,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: '#FF8060' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5C3A', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          Live deals — updated every 6 hours
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: -3, marginBottom: 28, maxWidth: 900 }}>
          Fly abroad for less<br/>than a{' '}
          <em style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FF5C3A' }}>domestic</em> trip.
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,245,236,0.55)', maxWidth: 520, lineHeight: 1.7, fontWeight: 300, marginBottom: 48 }}>
          Handpicked international flight deals from Delhi, Mumbai, Bangalore, Hyderabad &amp; Chennai. Minimum 40% off. Economy, Business and First Class.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '16px 36px', borderRadius: 100, fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}>
            Browse deals →
          </Link>
          <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,245,236,0.8)', padding: '16px 36px', borderRadius: 100, fontSize: 16, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.15)' }}>
            How it works
          </a>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', maxWidth: 720, width: '100%' }}>
          {[['2,400+', 'Active members'], ['₹18k+', 'Avg. savings'], ['40–90%', 'Off regular fares'], ['5 cities', 'DEL·BOM·BLR·HYD·MAA']].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(13,10,8,0.8)', padding: '22px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#FF5C3A', letterSpacing: -1 }}>{val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', letterSpacing: 1.2, marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SAMPLE DEALS ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 0 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Sample deals</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1 }}>What deals look like</h2>
            </div>
            <Link href="/deals" style={{ fontSize: 14, color: '#FF5C3A', textDecoration: 'none', fontWeight: 500 }}>See all live deals →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sampleDeals.map((deal, i) => (
              <div key={i} className="deal-card" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ padding: '20px 20px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ fontSize: 36 }}>{deal.flag}</div>
                    <span style={{ background: '#FF5C3A', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100 }}>{deal.off}% off</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{deal.from} → {deal.dest}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 2 }}>₹{deal.price.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.3)', textDecoration: 'line-through' }}>₹{deal.was.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,255,255,0.07)', borderRadius: 100, color: 'rgba(255,245,236,0.5)' }}>{deal.airline}</span>
                    <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,92,58,0.1)', borderRadius: 100, color: '#FF8060' }}>{deal.type}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: deal.stops === 0 ? '#4CAF50' : '#FF8060', display: 'inline-block' }}></span>
                    {deal.stops === 0 ? 'Non-stop' : '1 stop'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/deals" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,245,236,0.7)', padding: '12px 28px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.12)', display: 'inline-block' }}>
              Unlock all deals — ₹999/mo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '100px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
              We hunt deals.<br/>You book flights.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              { num: '01', icon: '🔍', title: 'We scan 95+ routes', desc: 'Our system checks Google Flights across 95 international routes from 5 Indian cities every 6 hours — automatically.' },
              { num: '02', icon: '⚡', title: 'Filter the real deals', desc: 'Only flights with 20%+ savings vs typical fares make the cut. No junk, no expired prices, no sponsored results.' },
              { num: '03', icon: '✈️', title: 'You book in seconds', desc: 'Click directly to Google Flights or the airline. No middlemen, no markup, no booking fees. Ever.' },
            ].map((step) => (
              <div key={step.num} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: 'rgba(255,92,58,0.15)', lineHeight: 1, marginBottom: 16 }}>{step.num}</div>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ─── */}
      <section id="destinations" style={{ position: 'relative', zIndex: 1, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Coverage</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
              5 cities.<br/>The whole world.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 40 }}>
            {[
              { code: 'DEL', city: 'Delhi', emoji: '🏛️' },
              { code: 'BOM', city: 'Mumbai', emoji: '🌊' },
              { code: 'BLR', city: 'Bangalore', emoji: '🌿' },
              { code: 'HYD', city: 'Hyderabad', emoji: '💎' },
              { code: 'MAA', city: 'Chennai', emoji: '🎭' },
            ].map((c) => (
              <div key={c.code} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '20px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{c.emoji}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{c.code}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)' }}>{c.city}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['🌏 South East Asia', '🗼 Japan & Korea', '🏰 Europe', '🗽 USA & Canada', '🕌 Middle East', '🦘 Oceania'].map((r) => (
              <span key={r} style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 100, padding: '8px 18px', fontSize: 13, color: '#FF8060' }}>{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '100px 48px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
              One trip pays for<br/><em style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FF5C3A' }}>18 months</em> of Pro.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,245,236,0.45)', fontWeight: 300 }}>Avg. member saves ₹18,000+ per trip. At ₹999/mo that's an 18x ROI on your first booking.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Free</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 4 }}>₹0</div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 28 }}>Forever free</div>
              {['3 deals visible', 'South East Asia only', 'Economy class', 'Email signup'].map((f) => (
                <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,245,236,0.2)', fontSize: 18 }}>·</span>{f}
                </div>
              ))}
              <Link href="/deals" style={{ display: 'block', textAlign: 'center', marginTop: 28, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,245,236,0.6)', padding: '13px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.1)' }}>
                Start free
              </Link>
            </div>

            <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.3)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF5C3A', color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 16px', borderRadius: '0 24px 0 12px', letterSpacing: 0.5 }}>MOST POPULAR</div>
              <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.8)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800 }}>₹999</span>
                <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.4)' }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 28 }}>Cancel anytime · No hidden fees</div>
              {['All deals unlocked', 'All regions & all classes', 'Early access (2 hrs before free)', 'WhatsApp deal alerts', 'Price history & analytics', 'Cancel anytime'].map((f) => (
                <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.75)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#4CAF50', fontWeight: 700 }}>✓</span>{f}
                </div>
              ))}
              <Link href="/pricing" style={{ display: 'block', textAlign: 'center', marginTop: 28, background: '#FF5C3A', color: 'white', padding: '14px', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                Upgrade to Pro →
              </Link>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.25)', marginTop: 10 }}>Secured by Razorpay · UPI, Cards, NetBanking</div>
            </div>
          </div>

          {/* ROI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', marginTop: 20 }}>
            {[['₹999', 'Monthly cost'], ['₹18,000+', 'Avg. savings per trip'], ['18x', 'ROI on first booking']].map(([val, label], i) => (
              <div key={label} style={{ padding: '20px', textAlign: 'center', borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#FF5C3A', letterSpacing: -1 }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.35)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 48px 100px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', background: 'linear-gradient(135deg, rgba(255,92,58,0.1) 0%, rgba(255,92,58,0.05) 100%)', border: '0.5px solid rgba(255,92,58,0.25)', borderRadius: 32, padding: '64px 56px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
            Your next trip is waiting.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,245,236,0.5)', marginBottom: 40, fontWeight: 300 }}>
            Browse live deals right now — no signup needed for the first 3.
          </p>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '18px 48px', borderRadius: 100, fontSize: 17, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", display: 'inline-block', letterSpacing: -0.3 }}>
            See live deals →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '36px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800 }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
          <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.25)' }}>· Sweet flight deals from India</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Deals', '/deals'], ['Pricing', '/pricing'], ['Login', '/login'], ['Admin', '/admin']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.2)' }}>© 2026 YoloFare</div>
      </footer>
    </div>
  )
}
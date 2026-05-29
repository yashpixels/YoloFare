'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .deal-card:hover { transform: translateY(-6px); border-color: rgba(255,92,58,0.4) !important; }
        .deal-card { transition: transform 0.25s, border-color 0.25s; }
        .nav-link:hover { color: #FFF5EC !important; }

        /* ── Layout classes ── */
        .nav-desktop  { display: flex; gap: 32px; align-items: center; }
        .hamburger    { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: #FFF5EC; line-height: 0; }
        .stats-grid   { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; max-width: 720px; width: 100%; }
        .deals-grid   { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .how-grid     { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; }
        .cities-grid  { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; margin-bottom: 40px; }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .roi-grid     { display: grid; grid-template-columns: repeat(3,1fr); background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; margin-top: 20px; }
        .sec          { padding: 80px 48px; }
        .deals-wrap   { padding: 0 48px; }
        .cta-inner    { padding: 64px 56px; }
        .footer-row   { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .hamburger   { display: flex; }
          .nav-bar     { padding: 0 20px !important; }

          .mobile-menu {
            position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 99;
            background: rgba(13,10,8,0.97); backdrop-filter: blur(20px);
            display: flex; flex-direction: column; padding: 32px 24px; gap: 4px;
          }
          .mobile-menu a {
            font-size: 22px; font-family: 'Syne', sans-serif; font-weight: 700;
            color: rgba(255,245,236,0.75); text-decoration: none;
            padding: 14px 0; border-bottom: 0.5px solid rgba(255,255,255,0.07);
            display: block;
          }
          .mobile-menu-btn {
            margin-top: 20px; background: #FF5C3A; color: white !important;
            text-align: center; padding: 16px 0 !important; border-radius: 100px;
            font-weight: 700 !important; border: none !important;
          }

          .hero-sec    { padding: 96px 20px 56px !important; }
          .hero-h1     { letter-spacing: -1px !important; line-height: 1.0 !important; }
          .hero-btns   { flex-direction: column; align-items: stretch; }
          .hero-btns a { text-align: center; }

          .stats-grid  { grid-template-columns: repeat(2,1fr); max-width: 100%; }

          .deals-grid  { grid-template-columns: 1fr; }
          .deals-wrap  { padding: 0 16px; }

          .how-grid    { grid-template-columns: 1fr; gap: 14px; }
          .sec         { padding: 56px 20px; }

          .cities-grid { grid-template-columns: repeat(3,1fr); gap: 8px; }

          .pricing-grid { grid-template-columns: 1fr; }

          .roi-grid    { grid-template-columns: 1fr; }
          .roi-cell    { border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.08) !important; }
          .roi-cell:last-child { border-bottom: none !important; }

          .cta-inner   { padding: 36px 24px; }
          .footer-row  { flex-direction: column; align-items: flex-start; gap: 20px; }
          .footer-bar  { padding: 28px 20px !important; }
        }

        /* ── Tablet ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .deals-grid  { grid-template-columns: repeat(2,1fr); }
          .sec         { padding: 72px 32px; }
          .deals-wrap  { padding: 0 32px; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.18, top: -200, right: -150 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.13, bottom: '20%', left: -150 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #FF8C5A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.07, top: '60%', left: '45%' }} />
      </div>

      {/* ── NAV ── */}
      <nav className="nav-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: scrolled ? 'rgba(13,10,8,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.08)' : 'none', transition: 'all 0.3s ease' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop">
          <a href="#how-it-works" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>How it works</a>
          <a href="#destinations" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Destinations</a>
          <a href="#pricing" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
          <Link href="/login" className="nav-link" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>Login</Link>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '9px 22px', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Browse deals →</Link>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#destinations" onClick={() => setMenuOpen(false)}>Destinations</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="/login" onClick={() => setMenuOpen(false)}>Login</a>
          <a href="/deals" className="mobile-menu-btn" onClick={() => setMenuOpen(false)}>Browse deals →</a>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero-sec" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,92,58,0.1)', border: '0.5px solid rgba(255,92,58,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: '#FF8060' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5C3A', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
          Live deals — updated every 6 hours
        </div>

        <h1 className="hero-h1" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 8vw, 96px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: -3, marginBottom: 28, maxWidth: 900 }}>
          Fly abroad for less<br/>than a{' '}
          <em style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FF5C3A' }}>domestic</em> trip.
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(255,245,236,0.55)', maxWidth: 520, lineHeight: 1.7, fontWeight: 300, marginBottom: 40, padding: '0 4px' }}>
          Handpicked international flight deals from Delhi, Mumbai, Bangalore, Hyderabad & Chennai. Minimum 40% off. Economy, Business and First Class.
        </p>

        <div className="hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, width: '100%', maxWidth: 440 }}>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '15px 32px', borderRadius: 100, fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3, flex: 1, textAlign: 'center', minWidth: 160 }}>
            Browse deals →
          </Link>
          <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,245,236,0.8)', padding: '15px 32px', borderRadius: 100, fontSize: 15, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.15)', flex: 1, textAlign: 'center', minWidth: 140 }}>
            How it works
          </a>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[['2,400+','Active members'],['₹18k+','Avg. savings'],['40–90%','Off regular fares'],['5 cities','DEL·BOM·BLR·HYD·MAA']].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(13,10,8,0.8)', padding: '20px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: '#FF5C3A', letterSpacing: -1 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,245,236,0.35)', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAMPLE DEALS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 0 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="deals-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Sample deals</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1 }}>What deals look like</h2>
              </div>
              <Link href="/deals" style={{ fontSize: 14, color: '#FF5C3A', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>See all live deals →</Link>
            </div>

            <div className="deals-grid">
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
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,255,255,0.07)', borderRadius: 100, color: 'rgba(255,245,236,0.5)' }}>{deal.airline}</span>
                      <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,92,58,0.1)', borderRadius: 100, color: '#FF8060' }}>{deal.type}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: deal.stops === 0 ? '#4CAF50' : '#FF8060', display: 'inline-block' }}/>
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
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="sec" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
              We hunt deals.<br/>You book flights.
            </h2>
          </div>
          <div className="how-grid">
            {[
              { num: '01', icon: '🔍', title: 'We scan 95+ routes', desc: 'Our system checks Google Flights across 95 international routes from 5 Indian cities every 6 hours — automatically.' },
              { num: '02', icon: '⚡', title: 'Filter the real deals', desc: 'Only flights with 20%+ savings vs typical fares make the cut. No junk, no expired prices, no sponsored results.' },
              { num: '03', icon: '✈️', title: 'You book in seconds', desc: 'Click directly to Google Flights or the airline. No middlemen, no markup, no booking fees. Ever.' },
            ].map((step) => (
              <div key={step.num} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: 'rgba(255,92,58,0.15)', lineHeight: 1, marginBottom: 14 }}>{step.num}</div>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section id="destinations" className="sec" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Coverage</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
              5 cities.<br/>The whole world.
            </h2>
          </div>
          <div className="cities-grid">
            {[
              { code: 'DEL', city: 'Delhi',     emoji: '🏛️' },
              { code: 'BOM', city: 'Mumbai',    emoji: '🌊' },
              { code: 'BLR', city: 'Bangalore', emoji: '🌿' },
              { code: 'HYD', city: 'Hyderabad', emoji: '💎' },
              { code: 'MAA', city: 'Chennai',   emoji: '🎭' },
            ].map((c) => (
              <div key={c.code} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{c.emoji}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{c.code}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)' }}>{c.city}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['🌏 South East Asia','🗼 Japan & Korea','🏰 Europe','🗽 USA & Canada','🕌 Middle East','🦘 Oceania'].map((r) => (
              <span key={r} style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 100, padding: '8px 16px', fontSize: 13, color: '#FF8060' }}>{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="sec" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
              One trip pays for<br/><em style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FF5C3A' }}>18 months</em> of Pro.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,245,236,0.45)', fontWeight: 300 }}>Avg. member saves ₹18,000+ per trip. At ₹999/mo that's an 18x ROI on your first booking.</p>
          </div>

          <div className="pricing-grid">
            {/* Free */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Free</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 4 }}>₹0</div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Forever free</div>
              {['3 deals visible','South East Asia only','Economy class','Email signup'].map((f) => (
                <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,245,236,0.2)', fontSize: 18 }}>·</span>{f}
                </div>
              ))}
              <Link href="/deals" style={{ display: 'block', textAlign: 'center', marginTop: 24, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,245,236,0.6)', padding: '13px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.1)' }}>
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.3)', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF5C3A', color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 16px', borderRadius: '0 24px 0 12px', letterSpacing: 0.5 }}>MOST POPULAR</div>
              <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.8)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800 }}>₹999</span>
                <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.4)' }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Cancel anytime · No hidden fees</div>
              {['All deals unlocked','All regions & all classes','Early access (2 hrs before free)','WhatsApp deal alerts','Price history & analytics','Cancel anytime'].map((f) => (
                <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.75)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#4CAF50', fontWeight: 700 }}>✓</span>{f}
                </div>
              ))}
              <Link href="/pricing" style={{ display: 'block', textAlign: 'center', marginTop: 24, background: '#FF5C3A', color: 'white', padding: '14px', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                Upgrade to Pro →
              </Link>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.25)', marginTop: 10 }}>Secured by Razorpay · UPI, Cards, NetBanking</div>
            </div>
          </div>

          {/* ROI strip */}
          <div className="roi-grid">
            {[['₹999','Monthly cost'],['₹18,000+','Avg. savings per trip'],['18x','ROI on first booking']].map(([val, label], i) => (
              <div key={label} className="roi-cell" style={{ padding: '20px', textAlign: 'center', borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#FF5C3A', letterSpacing: -1 }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.35)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', background: 'linear-gradient(135deg, rgba(255,92,58,0.1) 0%, rgba(255,92,58,0.05) 100%)', border: '0.5px solid rgba(255,92,58,0.25)', borderRadius: 28, textAlign: 'center' }}>
          <div className="cta-inner">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 5vw, 52px)', fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
              Your next trip is waiting.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,245,236,0.5)', marginBottom: 36, fontWeight: 300 }}>
              Browse live deals right now — no signup needed for the first 3.
            </p>
            <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '16px 44px', borderRadius: 100, fontSize: 16, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", display: 'inline-block', letterSpacing: -0.3 }}>
              See live deals →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-bar" style={{ position: 'relative', zIndex: 1, borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '36px 48px' }}>
        <div className="footer-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
              <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="29" cy="22" r="2" fill="#FF5C3A"/>
            </svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800 }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
            <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.25)' }}>· Sweet flight deals from India</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Deals','/deals'],['Pricing','/pricing'],['Login','/login'],['Admin','/admin']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.2)' }}>© 2026 YoloFare</div>
        </div>
      </footer>
    </div>
  )
}
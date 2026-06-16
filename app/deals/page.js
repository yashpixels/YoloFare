'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { trackDealClick } from '../../lib/pixel.js'

const REGIONS = ['All', 'South East Asia', 'Europe', 'USA', 'Canada', 'Middle East']
const CITIES = ['All Cities', 'DEL', 'BOM', 'BLR', 'HYD', 'MAA']
const CLASSES = ['All Classes', 'Economy', 'Business', 'First']

export default function DealsPage() {
  const [deals, setDeals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [region, setRegion]       = useState('All')
  const [city, setCity]           = useState('All Cities')
  const [cabinClass, setCabinClass] = useState('All Classes')
  const [user, setUser]           = useState(null)
  const [isPro, setIsPro]         = useState(false)  // ← actual subscription check

  useEffect(() => {
    fetchDeals()
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) checkProStatus(u.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) checkProStatus(u.id)
      else setIsPro(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Check if user has an active Pro subscription ──
  async function checkProStatus(userId) {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()
    setIsPro(!!data)
  }

  async function fetchDeals() {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (data) setDeals(data)
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setIsPro(false)
  }

  const filtered = deals.filter(d => {
    if (region !== 'All' && d.region !== region) return false
    if (city !== 'All Cities' && d.origin_code !== city) return false
    if (cabinClass !== 'All Classes' && d.cabin_class !== cabinClass) return false
    return true
  })

  const visibleDeals = isPro ? filtered : filtered.filter(d => d.is_free_preview)
  const totalDeals   = deals.length
  const freeDeals    = deals.filter(d => d.is_free_preview)

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap" rel="stylesheet" />
      <style>{`
        .deals-nav       { padding: 0 48px; }
        .nav-user-email  { display: inline; }
        .nav-signout     { display: inline-block; }
        .deals-container { padding: 48px 48px 80px; }
        .deals-grid      { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .banner-row      { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .banner-btns     { display: flex; gap: 10px; flex-shrink: 0; }
        .deal-card       { transition: transform 0.25s, border-color 0.25s; }
        .deal-card:hover { transform: translateY(-6px); border-color: rgba(255,92,58,0.4) !important; }
        @media (max-width: 768px) {
          .deals-nav       { padding: 0 16px; }
          .nav-user-email  { display: none; }
          .nav-signout     { display: none; }
          .nav-upgrade     { font-size: 12px !important; padding: 8px 14px !important; white-space: nowrap; }
          .deals-container { padding: 24px 16px 60px; }
          .deals-h1        { font-size: 32px !important; letter-spacing: -1px !important; }
          .deals-grid      { grid-template-columns: 1fr; gap: 14px; }
          .banner-row      { flex-direction: column; align-items: flex-start; }
          .banner-btns     { width: 100%; }
          .banner-btns a   { flex: 1; text-align: center; }
          .filter-pill     { padding: 7px 14px !important; font-size: 12px !important; }
          .filter-small    { padding: 5px 12px !important; font-size: 11px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .deals-grid      { grid-template-columns: repeat(2,1fr); }
          .deals-container { padding: 36px 32px 60px; }
          .deals-nav       { padding: 0 32px; }
        }
      `}</style>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.25, top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, bottom: '10%', left: -100 }} />
      </div>

      {/* Nav */}
      <nav className="deals-nav" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          {user ? (
            <>
              <span className="nav-user-email" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                {isPro ? '⭐' : '👋'} {user.email}
              </span>
              <button className="nav-signout" onClick={handleSignOut} style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', background: 'none', border: '0.5px solid rgba(255,255,255,0.12)', padding: '7px 16px', borderRadius: 100, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>Sign out</button>
              {!isPro && (
                <Link className="nav-upgrade" href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
                  Upgrade · ₹999/mo
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none', whiteSpace: 'nowrap' }} className="nav-signout">Login</Link>
              <Link className="nav-upgrade" href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade · ₹999/mo
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main */}
      <div className="deals-container" style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            {loading ? 'Loading...' : isPro ? `${visibleDeals.length} deals available` : `${freeDeals.length} free deals · ${totalDeals - freeDeals.length} more with Pro`}
          </div>
          <h1 className="deals-h1" style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: -1.5, marginBottom: 8 }}>
            Live flight deals
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.55)', fontWeight: 300 }}>
            Updated every 6 hours · 40% off minimum · Non-stop or 1 stop only
          </p>
        </div>

        {/* Region filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <button key={r} className="filter-pill" onClick={() => setRegion(r)} style={{ padding: '8px 18px', borderRadius: 100, fontSize: 13, cursor: 'pointer', background: region === r ? '#FF5C3A' : 'rgba(255,255,255,0.07)', color: region === r ? 'white' : 'rgba(255,245,236,0.55)', border: region === r ? '1px solid #FF5C3A' : '0.5px solid rgba(255,255,255,0.12)', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
              {r}
            </button>
          ))}
        </div>

        {/* City + Class filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {CITIES.map(c => (
            <button key={c} className="filter-small" onClick={() => setCity(c)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', background: city === c ? 'rgba(255,92,58,0.2)' : 'rgba(255,255,255,0.04)', color: city === c ? '#FF8060' : 'rgba(255,245,236,0.4)', border: city === c ? '0.5px solid rgba(255,92,58,0.4)' : '0.5px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif" }}>
              {c}
            </button>
          ))}
          {CLASSES.map(c => (
            <button key={c} className="filter-small" onClick={() => setCabinClass(c)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', background: cabinClass === c ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)', color: cabinClass === c ? '#FFD700' : 'rgba(255,245,236,0.4)', border: cabinClass === c ? '0.5px solid rgba(255,215,0,0.3)' : '0.5px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Banner — logged out */}
        {!user && (
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 28 }}>
            <div className="banner-row">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>You're on the free plan — {freeDeals.length} deals visible</div>
                <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>Sign in and upgrade to YoloFare Pro to unlock all {totalDeals} deals</div>
              </div>
              <div className="banner-btns">
                <Link href="/login" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '0.5px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 100, fontSize: 13, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-block', textAlign: 'center' }}>Sign in</Link>
                <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', display: 'inline-block', textAlign: 'center', whiteSpace: 'nowrap' }}>Upgrade · ₹999/mo</Link>
              </div>
            </div>
          </div>
        )}

        {/* Banner — logged in but NOT Pro */}
        {user && !isPro && (
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 28 }}>
            <div className="banner-row">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>You're signed in — upgrade to see all {totalDeals} deals</div>
                <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>YoloFare Pro unlocks everything · ₹999/mo</div>
              </div>
              <div className="banner-btns">
                <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', display: 'inline-block', textAlign: 'center', whiteSpace: 'nowrap' }}>Upgrade to Pro · ₹999/mo</Link>
              </div>
            </div>
          </div>
        )}

        {/* Banner — Pro member */}
        {user && isPro && (
          <div style={{ background: 'rgba(76,175,80,0.06)', border: '0.5px solid rgba(76,175,80,0.2)', borderRadius: 16, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Pro member — all {totalDeals} deals unlocked</span>
              <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', marginLeft: 12 }}>
                <Link href="/preferences" style={{ color: '#FF8060', textDecoration: 'none' }}>Update your preferences →</Link>
              </span>
            </div>
          </div>
        )}

        {/* Deals grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,245,236,0.3)' }}>Loading deals...</div>
        ) : visibleDeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ color: 'rgba(255,245,236,0.5)', fontSize: 15, marginBottom: 8 }}>No deals match your filters.</div>
            <div style={{ color: 'rgba(255,245,236,0.3)', fontSize: 13 }}>Try changing the region or cabin class.</div>
          </div>
        ) : (
          <>
            <div className="deals-grid">
              {visibleDeals.map((deal) => (
                <div key={deal.id} className="deal-card" style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', cursor: 'pointer' }}>
                  <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: '#1a1a2a' }}>
                    {deal.image_url && <img src={deal.image_url} alt={deal.destination} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} />}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(13,10,8,0.75) 100%)' }} />
                    <span style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(13,10,8,0.6)', color: 'rgba(255,245,236,0.9)', backdropFilter: 'blur(8px)', fontSize: 11, padding: '4px 10px', borderRadius: 100, border: '0.5px solid rgba(255,255,255,0.15)' }}>{deal.airline}</span>
                    <span style={{ position: 'absolute', top: 14, right: 14, background: '#FF5C3A', color: 'white', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 100 }}>{deal.savings_pct}% off</span>
                    <span style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{deal.destination}</span>
                    <span style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: deal.cabin_class === 'First' ? 'rgba(255,92,58,0.3)' : deal.cabin_class === 'Business' ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.15)', color: deal.cabin_class === 'First' ? '#FFAA88' : deal.cabin_class === 'Business' ? '#FFD700' : 'rgba(255,255,255,0.9)', border: '0.5px solid rgba(255,255,255,0.2)' }}>{deal.cabin_class}</span>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                      {deal.origin_code} → {deal.dest_code} · {deal.travel_dates}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>₹{deal.deal_price?.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.3)', textDecoration: 'line-through' }}>₹{deal.regular_price?.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.12)' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: deal.stops === 0 ? '#4CAF50' : '#FF8060', display: 'inline-block' }} />
                        {deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`}
                      </span>
                      <Link href={`/deals/${deal.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#FF5C3A', textDecoration: 'none' }}>View deal →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade nudge for non-Pro */}
            {!isPro && (
              <div style={{ marginTop: 40, background: 'linear-gradient(135deg, rgba(255,92,58,0.08) 0%, rgba(255,92,58,0.04) 100%)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 24, padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
                  {totalDeals - freeDeals.length} more deals locked
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', marginBottom: 24, fontWeight: 300 }}>
                  Europe, Middle East, Business & First Class deals — all unlocked with Pro.
                </div>
                <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '14px 36px', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif", display: 'inline-block' }}>
                  Unlock all deals · ₹999/mo →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

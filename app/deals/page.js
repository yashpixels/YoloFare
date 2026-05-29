'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const REGIONS = ['All', 'South East Asia', 'Europe', 'USA', 'Canada', 'Middle East']
const CITIES = ['All Cities', 'DEL', 'BOM', 'BLR', 'HYD', 'MAA']
const CLASSES = ['All Classes', 'Economy', 'Business', 'First']

export default function DealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('All')
  const [city, setCity] = useState('All Cities')
  const [cabinClass, setCabinClass] = useState('All Classes')
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchDeals()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

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
  }

  const filtered = deals.filter(d => {
    if (region !== 'All' && d.region !== region) return false
    if (city !== 'All Cities' && d.origin_code !== city) return false
    if (cabinClass !== 'All Classes' && d.cabin_class !== cabinClass) return false
    return true
  })

  const seaDeals = filtered.filter(d => d.region === 'South East Asia')
  const otherDeals = filtered.filter(d => d.region !== 'South East Asia')
  const sorted = [...seaDeals, ...otherDeals]
  const freeLimit = 3

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.25, top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, bottom: '10%', left: -100 }} />
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>👋 {user.email}</span>
              <button onClick={handleSignOut} style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', background: 'none', border: '0.5px solid rgba(255,255,255,0.12)', padding: '7px 16px', borderRadius: 100, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign out</button>
              <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'inline-block', fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade to Pro ₹999/mo
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none' }}>Login</Link>
              <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'inline-block', fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade to Pro ₹999/mo
              </Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '48px 48px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            {loading ? 'Loading...' : `${sorted.length} deals available`}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: -1.5, marginBottom: 8 }}>
            Live flight deals
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.55)', fontWeight: 300 }}>
            Updated every 6 hours · 40% off minimum · Non-stop or 1 stop only
          </p>
        </div>

        {/* Region Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)} style={{ padding: '8px 18px', borderRadius: 100, fontSize: 13, cursor: 'pointer', background: region === r ? '#FF5C3A' : 'rgba(255,255,255,0.07)', color: region === r ? 'white' : 'rgba(255,245,236,0.55)', border: region === r ? '1px solid #FF5C3A' : '0.5px solid rgba(255,255,255,0.12)', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
              {r}
            </button>
          ))}
        </div>

        {/* City + Class Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', background: city === c ? 'rgba(255,92,58,0.2)' : 'rgba(255,255,255,0.04)', color: city === c ? '#FF8060' : 'rgba(255,245,236,0.4)', border: city === c ? '0.5px solid rgba(255,92,58,0.4)' : '0.5px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif" }}>
              {c}
            </button>
          ))}
          {CLASSES.map(c => (
            <button key={c} onClick={() => setCabinClass(c)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', background: cabinClass === c ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)', color: cabinClass === c ? '#FFD700' : 'rgba(255,245,236,0.4)', border: cabinClass === c ? '0.5px solid rgba(255,215,0,0.3)' : '0.5px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Banners */}
        {!user && (
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 16, padding: '16px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>You're on the free plan — 3 deals visible</div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>Sign in and upgrade to YoloFare Pro to unlock all {sorted.length} deals</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/login" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '0.5px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 100, fontSize: 13, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                Sign in
              </Link>
              <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', display: 'inline-block' }}>
                Upgrade · ₹999/mo
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '0.5px solid rgba(255,92,58,0.2)', borderRadius: 16, padding: '16px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>You're signed in 🎉 Upgrade to see all deals</div>
              <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>YoloFare Pro unlocks all {sorted.length} deals · ₹999/mo</div>
            </div>
            <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', display: 'inline-block' }}>
              Upgrade to Pro · ₹999/mo
            </Link>
          </div>
        )}

        {/* Deals grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,245,236,0.3)' }}>Loading deals...</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,245,236,0.3)' }}>No deals found. Check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sorted.map((deal, i) => {
              const isLocked = i >= freeLimit
              return (
                <div key={deal.id} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', cursor: isLocked ? 'default' : 'pointer', transition: 'transform 0.25s, border-color 0.25s' }}
                  onMouseEnter={e => { if (!isLocked) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(255,92,58,0.4)' }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}>

                  <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: '#1a1a2a' }}>
                    {deal.image_url && <img src={deal.image_url} alt={deal.destination} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isLocked ? 'blur(8px)' : 'none', transform: 'scale(1.05)' }} />}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(13,10,8,0.75) 100%)' }} />
                    {isLocked && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(13,10,8,0.5)', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Pro deal</div>
                        <Link href="/pricing" style={{ background: '#FF5C3A', color: 'white', padding: '8px 20px', borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>Unlock · ₹999/mo</Link>
                      </div>
                    )}
                    {!isLocked && <>
                      <span style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(13,10,8,0.6)', color: 'rgba(255,245,236,0.9)', backdropFilter: 'blur(8px)', fontSize: 11, padding: '4px 10px', borderRadius: 100, border: '0.5px solid rgba(255,255,255,0.15)' }}>{deal.airline}</span>
                      <span style={{ position: 'absolute', top: 14, right: 14, background: '#FF5C3A', color: 'white', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 100 }}>{deal.savings_pct}% off</span>
                      <span style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{deal.destination}</span>
                      <span style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: deal.cabin_class === 'First' ? 'rgba(255,92,58,0.3)' : deal.cabin_class === 'Business' ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.15)', color: deal.cabin_class === 'First' ? '#FFAA88' : deal.cabin_class === 'Business' ? '#FFD700' : 'rgba(255,255,255,0.9)', border: '0.5px solid rgba(255,255,255,0.2)' }}>{deal.cabin_class}</span>
                    </>}
                  </div>

                  {!isLocked && (
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
                        {deal.origin_code} → {deal.dest_code} · {deal.travel_dates}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>₹{deal.deal_price.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.3)', textDecoration: 'line-through' }}>₹{deal.regular_price.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.12)' }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: deal.stops === 0 ? '#4CAF50' : '#FF8060', display: 'inline-block' }}></span>
                          {deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`}
                        </span>
                        <Link href={`/deals/${deal.id}`} style={{ fontSize: 13, fontWeight: 500, color: '#FF5C3A', textDecoration: 'none' }}>
                          View deal →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
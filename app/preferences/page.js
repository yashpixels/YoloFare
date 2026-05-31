'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ORIGIN_AIRPORTS = [
  { code: 'DEL', city: 'Delhi' },
  { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bangalore' },
  { code: 'HYD', city: 'Hyderabad' },
  { code: 'MAA', city: 'Chennai' },
]

const CABIN_CLASSES = ['All Classes', 'Economy', 'Business', 'First']

// 100 major tourist destination airports
const DESTINATIONS = [
  // South East Asia
  { code:'SIN', city:'Singapore', flag:'🇸🇬' },
  { code:'BKK', city:'Bangkok', flag:'🇹🇭' },
  { code:'DPS', city:'Bali', flag:'🇮🇩' },
  { code:'KUL', city:'Kuala Lumpur', flag:'🇲🇾' },
  { code:'HKG', city:'Hong Kong', flag:'🇭🇰' },
  { code:'MNL', city:'Manila', flag:'🇵🇭' },
  { code:'SGN', city:'Ho Chi Minh City', flag:'🇻🇳' },
  { code:'HAN', city:'Hanoi', flag:'🇻🇳' },
  { code:'CGK', city:'Jakarta', flag:'🇮🇩' },
  { code:'RGN', city:'Yangon', flag:'🇲🇲' },
  { code:'PNH', city:'Phnom Penh', flag:'🇰🇭' },
  { code:'REP', city:'Siem Reap', flag:'🇰🇭' },
  { code:'VTE', city:'Vientiane', flag:'🇱🇦' },
  { code:'CEB', city:'Cebu', flag:'🇵🇭' },
  { code:'DAD', city:'Da Nang', flag:'🇻🇳' },
  // Japan & Korea
  { code:'NRT', city:'Tokyo (Narita)', flag:'🇯🇵' },
  { code:'HND', city:'Tokyo (Haneda)', flag:'🇯🇵' },
  { code:'KIX', city:'Osaka', flag:'🇯🇵' },
  { code:'FUK', city:'Fukuoka', flag:'🇯🇵' },
  { code:'NGO', city:'Nagoya', flag:'🇯🇵' },
  { code:'CTS', city:'Sapporo', flag:'🇯🇵' },
  { code:'ICN', city:'Seoul (Incheon)', flag:'🇰🇷' },
  { code:'GMP', city:'Seoul (Gimpo)', flag:'🇰🇷' },
  { code:'PUS', city:'Busan', flag:'🇰🇷' },
  { code:'TPE', city:'Taipei', flag:'🇹🇼' },
  // Europe
  { code:'LHR', city:'London (Heathrow)', flag:'🇬🇧' },
  { code:'LGW', city:'London (Gatwick)', flag:'🇬🇧' },
  { code:'EDI', city:'Edinburgh', flag:'🇬🇧' },
  { code:'MAN', city:'Manchester', flag:'🇬🇧' },
  { code:'CDG', city:'Paris', flag:'🇫🇷' },
  { code:'AMS', city:'Amsterdam', flag:'🇳🇱' },
  { code:'FRA', city:'Frankfurt', flag:'🇩🇪' },
  { code:'MUC', city:'Munich', flag:'🇩🇪' },
  { code:'BER', city:'Berlin', flag:'🇩🇪' },
  { code:'ZRH', city:'Zurich', flag:'🇨🇭' },
  { code:'GVA', city:'Geneva', flag:'🇨🇭' },
  { code:'FCO', city:'Rome', flag:'🇮🇹' },
  { code:'MXP', city:'Milan', flag:'🇮🇹' },
  { code:'VCE', city:'Venice', flag:'🇮🇹' },
  { code:'BCN', city:'Barcelona', flag:'🇪🇸' },
  { code:'MAD', city:'Madrid', flag:'🇪🇸' },
  { code:'VIE', city:'Vienna', flag:'🇦🇹' },
  { code:'IST', city:'Istanbul', flag:'🇹🇷' },
  { code:'ATH', city:'Athens', flag:'🇬🇷' },
  { code:'SKG', city:'Thessaloniki', flag:'🇬🇷' },
  { code:'PRG', city:'Prague', flag:'🇨🇿' },
  { code:'BUD', city:'Budapest', flag:'🇭🇺' },
  { code:'WAW', city:'Warsaw', flag:'🇵🇱' },
  { code:'CPH', city:'Copenhagen', flag:'🇩🇰' },
  { code:'OSL', city:'Oslo', flag:'🇳🇴' },
  { code:'ARN', city:'Stockholm', flag:'🇸🇪' },
  { code:'HEL', city:'Helsinki', flag:'🇫🇮' },
  { code:'DUB', city:'Dublin', flag:'🇮🇪' },
  { code:'LIS', city:'Lisbon', flag:'🇵🇹' },
  { code:'BRU', city:'Brussels', flag:'🇧🇪' },
  // Middle East
  { code:'DXB', city:'Dubai', flag:'🇦🇪' },
  { code:'AUH', city:'Abu Dhabi', flag:'🇦🇪' },
  { code:'DOH', city:'Doha', flag:'🇶🇦' },
  { code:'KWI', city:'Kuwait City', flag:'🇰🇼' },
  { code:'BAH', city:'Bahrain', flag:'🇧🇭' },
  { code:'MCT', city:'Muscat', flag:'🇴🇲' },
  { code:'RUH', city:'Riyadh', flag:'🇸🇦' },
  { code:'JED', city:'Jeddah', flag:'🇸🇦' },
  { code:'AMM', city:'Amman', flag:'🇯🇴' },
  { code:'BEY', city:'Beirut', flag:'🇱🇧' },
  { code:'TLV', city:'Tel Aviv', flag:'🇮🇱' },
  { code:'CAI', city:'Cairo', flag:'🇪🇬' },
  // USA & Canada
  { code:'JFK', city:'New York (JFK)', flag:'🇺🇸' },
  { code:'EWR', city:'New York (Newark)', flag:'🇺🇸' },
  { code:'LAX', city:'Los Angeles', flag:'🇺🇸' },
  { code:'SFO', city:'San Francisco', flag:'🇺🇸' },
  { code:'ORD', city:'Chicago', flag:'🇺🇸' },
  { code:'MIA', city:'Miami', flag:'🇺🇸' },
  { code:'SEA', city:'Seattle', flag:'🇺🇸' },
  { code:'BOS', city:'Boston', flag:'🇺🇸' },
  { code:'IAD', city:'Washington DC', flag:'🇺🇸' },
  { code:'LAS', city:'Las Vegas', flag:'🇺🇸' },
  { code:'YYZ', city:'Toronto', flag:'🇨🇦' },
  { code:'YVR', city:'Vancouver', flag:'🇨🇦' },
  { code:'YUL', city:'Montreal', flag:'🇨🇦' },
  // Australia & Oceania
  { code:'SYD', city:'Sydney', flag:'🇦🇺' },
  { code:'MEL', city:'Melbourne', flag:'🇦🇺' },
  { code:'BNE', city:'Brisbane', flag:'🇦🇺' },
  { code:'PER', city:'Perth', flag:'🇦🇺' },
  { code:'AKL', city:'Auckland', flag:'🇳🇿' },
  { code:'CHC', city:'Christchurch', flag:'🇳🇿' },
  { code:'NAN', city:'Fiji (Nadi)', flag:'🇫🇯' },
  // Africa
  { code:'NBO', city:'Nairobi', flag:'🇰🇪' },
  { code:'JNB', city:'Johannesburg', flag:'🇿🇦' },
  { code:'CPT', city:'Cape Town', flag:'🇿🇦' },
  { code:'ADD', city:'Addis Ababa', flag:'🇪🇹' },
  // Indian Ocean / Islands
  { code:'MLE', city:'Maldives (Malé)', flag:'🇲🇻' },
  { code:'SEZ', city:'Seychelles', flag:'🇸🇨' },
  { code:'MRU', city:'Mauritius', flag:'🇲🇺' },
  // South America
  { code:'GRU', city:'São Paulo', flag:'🇧🇷' },
  { code:'GIG', city:'Rio de Janeiro', flag:'🇧🇷' },
  { code:'EZE', city:'Buenos Aires', flag:'🇦🇷' },
  { code:'SCL', city:'Santiago', flag:'🇨🇱' },
  { code:'BOG', city:'Bogotá', flag:'🇨🇴' },
  { code:'LIM', city:'Lima', flag:'🇵🇪' },
]

export default function PreferencesPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const [prefs, setPrefs] = useState({
    phone: '',
    whatsapp_opted_in: false,
    preferred_destinations: [],
    other_destination: '',
    preferred_origins: [],
    preferred_class: 'All Classes',
  })
  const [showOther, setShowOther] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { router.push('/login'); return }
      setUser(session.user)
      loadPrefs(session.user.id)
    })
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function loadPrefs(userId) {
    const { data } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single()
    if (data) {
      setPrefs({
        phone: data.phone || '',
        whatsapp_opted_in: data.whatsapp_opted_in || false,
        preferred_destinations: data.preferred_destinations || [],
        other_destination: data.other_destination || '',
        preferred_origins: data.preferred_origins || [],
        preferred_class: data.preferred_class || 'All Classes',
      })
      if (data.other_destination) setShowOther(true)
    }
    setLoading(false)
  }

  function toggleDestination(code) {
    setPrefs(p => ({
      ...p,
      preferred_destinations: p.preferred_destinations.includes(code)
        ? p.preferred_destinations.filter(c => c !== code)
        : [...p.preferred_destinations, code]
    }))
  }

  function toggleOrigin(code) {
    setPrefs(p => ({
      ...p,
      preferred_origins: p.preferred_origins.includes(code)
        ? p.preferred_origins.filter(c => c !== code)
        : [...p.preferred_origins, code]
    }))
  }

  function handleOtherToggle() {
    setShowOther(v => {
      if (v) setPrefs(p => ({ ...p, other_destination: '' }))
      return !v
    })
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    const payload = {
      user_id: user.id,
      phone: prefs.phone || null,
      whatsapp_opted_in: prefs.whatsapp_opted_in,
      preferred_destinations: prefs.preferred_destinations,
      other_destination: prefs.other_destination || null,
      preferred_origins: prefs.preferred_origins,
      preferred_class: prefs.preferred_class,
      updated_at: new Date().toISOString(),
    }
    await supabase.from('user_preferences').upsert(payload, { onConflict: 'user_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const filteredDests = DESTINATIONS.filter(d =>
    d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedDests = DESTINATIONS.filter(d => prefs.preferred_destinations.includes(d.code))

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; font-size: 13px; cursor: pointer; border: 0.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); color: rgba(255,245,236,0.6); transition: all 0.15s; user-select: none; }
        .chip:hover { border-color: rgba(255,92,58,0.4); color: #FFF5EC; }
        .chip.selected { background: rgba(255,92,58,0.15); border-color: rgba(255,92,58,0.5); color: #FF8060; }
        .origin-chip { padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 500; }
        .dest-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: background 0.15s; }
        .dest-row:hover { background: rgba(255,255,255,0.06); }
        .dest-row.selected { background: rgba(255,92,58,0.1); }
        .search-input:focus { outline: none; border-color: rgba(255,92,58,0.5) !important; }
      `}</style>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15, top: -150, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.1, bottom: '10%', left: -100 }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </Link>
        <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', textDecoration: 'none' }}>← Back to deals</Link>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1.5, marginBottom: 8 }}>Your preferences ✈️</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,245,236,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
            Tell us where you want to fly and how — we'll only send you deals that actually matter to you.
          </p>
        </div>

        {/* ── SECTION 1: Phone + WhatsApp ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>📱 WhatsApp alerts</div>
          <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.45)', marginBottom: 20, lineHeight: 1.6 }}>Get instant deal alerts on WhatsApp. Optional — we'll never spam you.</p>

          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Phone number (with country code)</label>
          <input
            type="tel"
            value={prefs.phone}
            onChange={e => setPrefs(p => ({ ...p, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Opt in to WhatsApp alerts</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)' }}>We'll message you when a deal matches your wishlist</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, flexShrink: 0 }}>
              <input type="checkbox" checked={prefs.whatsapp_opted_in} onChange={e => setPrefs(p => ({ ...p, whatsapp_opted_in: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: prefs.whatsapp_opted_in ? '#25D366' : 'rgba(255,255,255,0.15)', borderRadius: 26, transition: '0.3s' }}>
                <span style={{ position: 'absolute', height: 20, width: 20, left: prefs.whatsapp_opted_in ? 24 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
              </span>
            </label>
          </div>
        </div>

        {/* ── SECTION 2: Destination Wishlist ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🌍 Destination wishlist</div>
          <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.45)', marginBottom: 20, lineHeight: 1.6 }}>Select all destinations you'd love to visit. We'll alert you when deals drop for these.</p>

          {/* Selected chips */}
          {prefs.preferred_destinations.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {selectedDests.map(d => (
                <span key={d.code} className="chip selected" onClick={() => toggleDestination(d.code)}>
                  {d.flag} {d.city} <span style={{ opacity: 0.6, fontSize: 11 }}>✕</span>
                </span>
              ))}
              {prefs.other_destination && (
                <span className="chip selected" onClick={handleOtherToggle}>
                  📍 {prefs.other_destination} <span style={{ opacity: 0.6, fontSize: 11 }}>✕</span>
                </span>
              )}
            </div>
          )}

          {/* Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <input
              className="search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              placeholder="🔍  Search destinations..."
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#1a1410', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 14, marginTop: 6, maxHeight: 280, overflowY: 'auto', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                {filteredDests.map(d => (
                  <div key={d.code} className={`dest-row ${prefs.preferred_destinations.includes(d.code) ? 'selected' : ''}`} onClick={() => { toggleDestination(d.code); setSearchQuery('') }}>
                    <span style={{ fontSize: 20 }}>{d.flag}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#FFF5EC' }}>{d.city}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginLeft: 8 }}>{d.code}</span>
                    </div>
                    {prefs.preferred_destinations.includes(d.code) && <span style={{ color: '#FF5C3A', fontSize: 14 }}>✓</span>}
                  </div>
                ))}
                {/* Other option */}
                <div className={`dest-row ${showOther ? 'selected' : ''}`} onClick={() => { handleOtherToggle(); setDropdownOpen(false); setSearchQuery('') }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#FFF5EC' }}>Other destination</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginLeft: 8 }}>Type your own</span>
                  </div>
                  {showOther && <span style={{ color: '#FF5C3A', fontSize: 14 }}>✓</span>}
                </div>
              </div>
            )}
          </div>

          {/* Other text input */}
          {showOther && (
            <input
              type="text"
              value={prefs.other_destination}
              onChange={e => setPrefs(p => ({ ...p, other_destination: e.target.value }))}
              placeholder="e.g. Reykjavik, Iceland"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,92,58,0.3)', borderRadius: 12, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginTop: 12, boxSizing: 'border-box' }}
              autoFocus
            />
          )}

          {prefs.preferred_destinations.length === 0 && !showOther && (
            <p style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', marginTop: 10, marginBottom: 0 }}>No destinations selected — you'll receive alerts for all deals.</p>
          )}
        </div>

        {/* ── SECTION 3: Departure airports ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🛫 Preferred departure cities</div>
          <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.45)', marginBottom: 20, lineHeight: 1.6 }}>Which cities do you usually fly from? Select all that apply.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ORIGIN_AIRPORTS.map(a => (
              <div key={a.code} className={`chip origin-chip ${prefs.preferred_origins.includes(a.code) ? 'selected' : ''}`} onClick={() => toggleOrigin(a.code)}>
                {a.city}
                <span style={{ fontSize: 12, opacity: 0.6 }}>({a.code})</span>
              </div>
            ))}
          </div>
          {prefs.preferred_origins.length === 0 && (
            <p style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', marginTop: 12, marginBottom: 0 }}>None selected — you'll receive deals from all cities.</p>
          )}
        </div>

        {/* ── SECTION 4: Cabin class ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 28px', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>💺 Preferred cabin class</div>
          <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.45)', marginBottom: 20, lineHeight: 1.6 }}>Which class do you usually fly?</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CABIN_CLASSES.map(c => (
              <div key={c} className={`chip origin-chip ${prefs.preferred_class === c ? 'selected' : ''}`} onClick={() => setPrefs(p => ({ ...p, preferred_class: c }))}>
                {c === 'All Classes' ? '✈️ All Classes' : c === 'Economy' ? '🟢 Economy' : c === 'Business' ? '🟡 Business' : '⭐ First'}
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: saved ? '#4CAF50' : '#FF5C3A', color: 'white', border: 'none', padding: '16px', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.8 : 1, transition: 'background 0.3s' }}>
          {saving ? 'Saving...' : saved ? '✅ Preferences saved!' : 'Save preferences →'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,245,236,0.3)', marginTop: 12 }}>
          You can update these anytime. Deals page will reflect your preferences immediately.
        </p>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const ADMIN_PASSWORD = 'yolofare@admin2026'
const REGIONS = ['South East Asia', 'Europe', 'USA', 'Canada', 'Middle East', 'Oceania', 'Australia']
const CLASSES = ['Economy', 'Business', 'First']
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai']
const CITY_CODES = { 'Delhi': 'DEL', 'Mumbai': 'BOM', 'Bangalore': 'BLR', 'Hyderabad': 'HYD', 'Chennai': 'MAA' }

// ── Comprehensive airport → city/country/region map ──
const AIRPORT_MAP = {
  // South East Asia
  SIN: { city: 'Singapore',        country: 'SG', region: 'South East Asia' },
  BKK: { city: 'Bangkok',          country: 'TH', region: 'South East Asia' },
  DMK: { city: 'Bangkok',          country: 'TH', region: 'South East Asia' },
  DPS: { city: 'Bali',             country: 'ID', region: 'South East Asia' },
  KUL: { city: 'Kuala Lumpur',     country: 'MY', region: 'South East Asia' },
  HKG: { city: 'Hong Kong',        country: 'HK', region: 'South East Asia' },
  MNL: { city: 'Manila',           country: 'PH', region: 'South East Asia' },
  SGN: { city: 'Ho Chi Minh City', country: 'VN', region: 'South East Asia' },
  HAN: { city: 'Hanoi',            country: 'VN', region: 'South East Asia' },
  ICN: { city: 'Seoul',            country: 'KR', region: 'South East Asia' },
  GMP: { city: 'Seoul',            country: 'KR', region: 'South East Asia' },
  NRT: { city: 'Tokyo',            country: 'JP', region: 'South East Asia' },
  HND: { city: 'Tokyo',            country: 'JP', region: 'South East Asia' },
  KIX: { city: 'Osaka',            country: 'JP', region: 'South East Asia' },
  TPE: { city: 'Taipei',           country: 'TW', region: 'South East Asia' },
  CGK: { city: 'Jakarta',          country: 'ID', region: 'South East Asia' },
  RGN: { city: 'Yangon',           country: 'MM', region: 'South East Asia' },
  PNH: { city: 'Phnom Penh',       country: 'KH', region: 'South East Asia' },
  REP: { city: 'Siem Reap',        country: 'KH', region: 'South East Asia' },
  VTE: { city: 'Vientiane',        country: 'LA', region: 'South East Asia' },
  CEB: { city: 'Cebu',             country: 'PH', region: 'South East Asia' },
  // Europe
  LHR: { city: 'London',           country: 'GB', region: 'Europe' },
  LGW: { city: 'London',           country: 'GB', region: 'Europe' },
  STN: { city: 'London',           country: 'GB', region: 'Europe' },
  CDG: { city: 'Paris',            country: 'FR', region: 'Europe' },
  ORY: { city: 'Paris',            country: 'FR', region: 'Europe' },
  AMS: { city: 'Amsterdam',        country: 'NL', region: 'Europe' },
  FRA: { city: 'Frankfurt',        country: 'DE', region: 'Europe' },
  MUC: { city: 'Munich',           country: 'DE', region: 'Europe' },
  ZRH: { city: 'Zurich',           country: 'CH', region: 'Europe' },
  GVA: { city: 'Geneva',           country: 'CH', region: 'Europe' },
  FCO: { city: 'Rome',             country: 'IT', region: 'Europe' },
  MXP: { city: 'Milan',            country: 'IT', region: 'Europe' },
  BCN: { city: 'Barcelona',        country: 'ES', region: 'Europe' },
  MAD: { city: 'Madrid',           country: 'ES', region: 'Europe' },
  VIE: { city: 'Vienna',           country: 'AT', region: 'Europe' },
  IST: { city: 'Istanbul',         country: 'TR', region: 'Europe' },
  ATH: { city: 'Athens',           country: 'GR', region: 'Europe' },
  PRG: { city: 'Prague',           country: 'CZ', region: 'Europe' },
  CPH: { city: 'Copenhagen',       country: 'DK', region: 'Europe' },
  OSL: { city: 'Oslo',             country: 'NO', region: 'Europe' },
  ARN: { city: 'Stockholm',        country: 'SE', region: 'Europe' },
  HEL: { city: 'Helsinki',         country: 'FI', region: 'Europe' },
  DUB: { city: 'Dublin',           country: 'IE', region: 'Europe' },
  BRU: { city: 'Brussels',         country: 'BE', region: 'Europe' },
  LIS: { city: 'Lisbon',           country: 'PT', region: 'Europe' },
  WAW: { city: 'Warsaw',           country: 'PL', region: 'Europe' },
  BUD: { city: 'Budapest',         country: 'HU', region: 'Europe' },
  // Middle East
  DXB: { city: 'Dubai',            country: 'AE', region: 'Middle East' },
  AUH: { city: 'Abu Dhabi',        country: 'AE', region: 'Middle East' },
  DOH: { city: 'Doha',             country: 'QA', region: 'Middle East' },
  KWI: { city: 'Kuwait City',      country: 'KW', region: 'Middle East' },
  BAH: { city: 'Bahrain',          country: 'BH', region: 'Middle East' },
  MCT: { city: 'Muscat',           country: 'OM', region: 'Middle East' },
  RUH: { city: 'Riyadh',           country: 'SA', region: 'Middle East' },
  JED: { city: 'Jeddah',           country: 'SA', region: 'Middle East' },
  AMM: { city: 'Amman',            country: 'JO', region: 'Middle East' },
  TLV: { city: 'Tel Aviv',         country: 'IL', region: 'Middle East' },
  // USA
  JFK: { city: 'New York',         country: 'US', region: 'USA' },
  EWR: { city: 'New York',         country: 'US', region: 'USA' },
  LAX: { city: 'Los Angeles',      country: 'US', region: 'USA' },
  ORD: { city: 'Chicago',          country: 'US', region: 'USA' },
  SFO: { city: 'San Francisco',    country: 'US', region: 'USA' },
  MIA: { city: 'Miami',            country: 'US', region: 'USA' },
  SEA: { city: 'Seattle',          country: 'US', region: 'USA' },
  BOS: { city: 'Boston',           country: 'US', region: 'USA' },
  IAD: { city: 'Washington DC',    country: 'US', region: 'USA' },
  DFW: { city: 'Dallas',           country: 'US', region: 'USA' },
  ATL: { city: 'Atlanta',          country: 'US', region: 'USA' },
  IAH: { city: 'Houston',          country: 'US', region: 'USA' },
  LAS: { city: 'Las Vegas',        country: 'US', region: 'USA' },
  // Canada
  YYZ: { city: 'Toronto',          country: 'CA', region: 'Canada' },
  YVR: { city: 'Vancouver',        country: 'CA', region: 'Canada' },
  YUL: { city: 'Montreal',         country: 'CA', region: 'Canada' },
  YYC: { city: 'Calgary',          country: 'CA', region: 'Canada' },
  // Australia / Oceania
  SYD: { city: 'Sydney',           country: 'AU', region: 'Australia' },
  MEL: { city: 'Melbourne',        country: 'AU', region: 'Australia' },
  BNE: { city: 'Brisbane',         country: 'AU', region: 'Australia' },
  PER: { city: 'Perth',            country: 'AU', region: 'Australia' },
  AKL: { city: 'Auckland',         country: 'NZ', region: 'Oceania' },
  // Indian origins
  DEL: { city: 'Delhi',     country: 'IN', region: null },
  BOM: { city: 'Mumbai',    country: 'IN', region: null },
  BLR: { city: 'Bangalore', country: 'IN', region: null },
  HYD: { city: 'Hyderabad', country: 'IN', region: null },
  MAA: { city: 'Chennai',   country: 'IN', region: null },
}

const INDIAN_CODES = new Set(['DEL','BOM','BLR','HYD','MAA'])

const MONTHS = { '01':'January','02':'February','03':'March','04':'April','05':'May','06':'June','07':'July','08':'August','09':'September','10':'October','11':'November','12':'December' }

// ── Parse Google Flights tfs base64 parameter ──
function parseGoogleFlightsUrl(url) {
  const result = { origin_code: '', dest_code: '', travel_dates: '', autoFilled: [] }
  try {
    const urlObj = new URL(url)
    const tfs = urlObj.searchParams.get('tfs')
    if (!tfs) return result

    // Decode base64 → binary string
    const b64 = tfs.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '=='.slice((b64.length * 6) % 8 / 2)
    const binary = atob(padded)

    // 1. Extract date YYYY-MM-DD embedded as ASCII in the protobuf
    const dateMatch = binary.match(/(\d{4}-\d{2}-\d{2})/)
    if (dateMatch) {
      const [year, month] = dateMatch[1].split('-')
      result.travel_dates = `${MONTHS[month]} ${year}`
      result.autoFilled.push('travel_dates')
    }

    // 2. Extract 3-char uppercase IATA codes from the binary
    const foundCodes = []
    for (let i = 0; i < binary.length - 2; i++) {
      const c0 = binary.charCodeAt(i)
      const c1 = binary.charCodeAt(i + 1)
      const c2 = binary.charCodeAt(i + 2)
      if (c0 >= 65 && c0 <= 90 && c1 >= 65 && c1 <= 90 && c2 >= 65 && c2 <= 90) {
        const code = binary.slice(i, i + 3)
        if (AIRPORT_MAP[code]) foundCodes.push(code)
      }
    }

    const unique = [...new Set(foundCodes)]
    const origins = unique.filter(c => INDIAN_CODES.has(c))
    const dests   = unique.filter(c => !INDIAN_CODES.has(c))

    if (origins.length > 0) {
      result.origin_code = origins[0]
      result.autoFilled.push('origin_code')
    }
    if (dests.length > 0) {
      result.dest_code = dests[0]
      result.autoFilled.push('dest_code')
      const info = AIRPORT_MAP[dests[0]]
      if (info) {
        result.destination = info.city
        result.country     = info.country
        result.region      = info.region || 'South East Asia'
        result.autoFilled.push('destination', 'country', 'region')
      }
    }
    if (origins.length > 0) {
      const originInfo = AIRPORT_MAP[origins[0]]
      if (originInfo) {
        result.origin_city = originInfo.city
        result.autoFilled.push('origin_city')
      }
    }
  } catch (e) { /* silent */ }
  return result
}

const EMPTY_FORM = {
  destination: '', country: '', region: 'South East Asia',
  origin_city: 'Delhi', origin_code: 'DEL', dest_code: '',
  airline: '', cabin_class: 'Economy',
  deal_price: '', regular_price: '', savings_pct: '',
  stops: '0', travel_dates: '', booking_url: '', image_url: '', description: '',
  expires_hours: '48'
}

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false)
  const [password, setPassword]   = useState('')
  const [pwError, setPwError]     = useState('')
  const [deals, setDeals]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [message, setMessage]     = useState('')
  const [tab, setTab]             = useState('add')
  const [editId, setEditId]       = useState(null)
  const [flightUrl, setFlightUrl] = useState('')
  const [autoFilled, setAutoFilled] = useState([])
  const [parseMsg, setParseMsg]   = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('yf_admin_auth')
    if (saved === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    if (authed) fetchDeals()
  }, [authed])

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      localStorage.setItem('yf_admin_auth', 'true')
    } else {
      setPwError('Wrong password')
    }
  }

  async function fetchDeals() {
    setLoading(true)
    const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false })
    if (data) setDeals(data)
    setLoading(false)
  }

  // ── Auto-parse when Google Flights URL is pasted ──
  function handleFlightUrlChange(e) {
    const url = e.target.value
    setFlightUrl(url)
    setParseMsg('')
    setAutoFilled([])
    if (!url.includes('google.com/travel/flights')) return

    const parsed = parseGoogleFlightsUrl(url)
    if (parsed.autoFilled.length === 0) {
      setParseMsg('⚠️ Could not extract details — fill fields manually below.')
      setForm(f => ({ ...f, booking_url: url }))
      return
    }

    setForm(f => ({
      ...f,
      booking_url:  url,
      dest_code:    parsed.dest_code    || f.dest_code,
      destination:  parsed.destination  || f.destination,
      country:      parsed.country      || f.country,
      region:       parsed.region       || f.region,
      origin_code:  parsed.origin_code  || f.origin_code,
      origin_city:  parsed.origin_city  || f.origin_city,
      travel_dates: parsed.travel_dates || f.travel_dates,
    }))
    setAutoFilled(parsed.autoFilled)
    const count = parsed.autoFilled.length
    setParseMsg(`✅ Auto-filled ${count} fields from URL. Just add price, airline & stops below.`)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    if (name === 'deal_price' || name === 'regular_price') {
      const deal    = parseFloat(name === 'deal_price'    ? value : form.deal_price)
      const regular = parseFloat(name === 'regular_price' ? value : form.regular_price)
      if (deal && regular && regular > deal)
        updated.savings_pct = Math.round(((regular - deal) / regular) * 100).toString()
    }
    if (name === 'origin_city') updated.origin_code = CITY_CODES[value] || ''
    setForm(updated)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const expiresAt = new Date(Date.now() + parseInt(form.expires_hours) * 60 * 60 * 1000).toISOString()
    const dealData = {
      destination:  form.destination,
      country:      form.country,
      region:       form.region,
      origin_city:  form.origin_city,
      origin_code:  form.origin_code,
      dest_code:    form.dest_code.toUpperCase(),
      airline:      form.airline,
      cabin_class:  form.cabin_class,
      deal_price:   parseInt(form.deal_price),
      regular_price: parseInt(form.regular_price),
      savings_pct:  parseInt(form.savings_pct),
      stops:        parseInt(form.stops),
      travel_dates: form.travel_dates,
      booking_url:  form.booking_url,
      image_url:    form.image_url,
      description:  form.description,
      is_active:    true,
      expires_at:   expiresAt,
    }
    let error
    if (editId) {
      const res = await supabase.from('deals').update(dealData).eq('id', editId)
      error = res.error
    } else {
      const res = await supabase.from('deals').insert(dealData)
      error = res.error
    }
    if (error) {
      setMessage(`❌ Error: ${error.message}`)
    } else {
      setMessage(editId ? '✅ Deal updated!' : '✅ Deal added successfully!')
      setForm(EMPTY_FORM)
      setFlightUrl('')
      setAutoFilled([])
      setParseMsg('')
      setEditId(null)
      fetchDeals()
      setTab('manage')
    }
    setSaving(false)
  }

  async function toggleActive(deal) {
    await supabase.from('deals').update({ is_active: !deal.is_active }).eq('id', deal.id)
    fetchDeals()
  }

  async function deleteDeal(id) {
    if (!confirm('Delete this deal permanently?')) return
    await supabase.from('deals').delete().eq('id', id)
    fetchDeals()
  }

  function editDeal(deal) {
    setForm({
      destination:  deal.destination  || '',
      country:      deal.country      || '',
      region:       deal.region       || 'South East Asia',
      origin_city:  deal.origin_city  || 'Delhi',
      origin_code:  deal.origin_code  || 'DEL',
      dest_code:    deal.dest_code    || '',
      airline:      deal.airline      || '',
      cabin_class:  deal.cabin_class  || 'Economy',
      deal_price:   deal.deal_price?.toString()   || '',
      regular_price: deal.regular_price?.toString() || '',
      savings_pct:  deal.savings_pct?.toString()  || '',
      stops:        deal.stops?.toString()        || '0',
      travel_dates: deal.travel_dates || '',
      booking_url:  deal.booking_url  || '',
      image_url:    deal.image_url    || '',
      description:  deal.description  || '',
      expires_hours: '48'
    })
    setFlightUrl(deal.booking_url || '')
    setAutoFilled([])
    setParseMsg('')
    setEditId(deal.id)
    setTab('add')
    window.scrollTo(0, 0)
  }

  const isAutoFilled = (field) => autoFilled.includes(field)
  const autoTag = { fontSize: 10, color: '#4CAF50', fontWeight: 600, marginLeft: 6 }

  const s = {
    page:   { minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", padding: '0 0 80px' },
    nav:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 60, background: 'rgba(255,255,255,0.05)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' },
    logo:   { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC', textDecoration: 'none' },
    wrap:   { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
    label:  { display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
    input:  { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' },
    inputAuto: { width: '100%', padding: '12px 14px', background: 'rgba(76,175,80,0.07)', border: '0.5px solid rgba(76,175,80,0.35)', borderRadius: 10, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px 14px', background: '#1a1410', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16 },
    selectAuto: { width: '100%', padding: '12px 14px', background: 'rgba(76,175,80,0.07)', border: '0.5px solid rgba(76,175,80,0.35)', borderRadius: 10, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16 },
    btn:    { background: '#FF5C3A', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    card:   { background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    grid2:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
    grid3:  { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' },
    tab:    (active) => ({ padding: '10px 24px', borderRadius: 100, fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif", background: active ? '#FF5C3A' : 'rgba(255,255,255,0.07)', color: active ? 'white' : 'rgba(255,245,236,0.55)' }),
  }

  if (!authed) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ width: 360, background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 36 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Panel</div>
        <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', marginBottom: 28 }}>YoloFare deal management</div>
        <form onSubmit={handleLogin}>
          <label style={s.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={s.input} placeholder="Enter admin password" />
          {pwError && <div style={{ color: '#FF8060', fontSize: 13, marginBottom: 12 }}>{pwError}</div>}
          <button type="submit" style={{ ...s.btn, width: '100%' }}>Enter →</button>
        </form>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <nav style={s.nav}>
        <span style={s.logo}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span> Admin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', textDecoration: 'none' }}>View site</Link>
          <button onClick={() => { localStorage.removeItem('yf_admin_auth'); setAuthed(false) }} style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', background: 'none', border: '0.5px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 100, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign out</button>
        </div>
      </nav>

      <div style={s.wrap}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
          {[
            ['Total deals', deals.length],
            ['Active', deals.filter(d => d.is_active).length],
            ['Inactive', deals.filter(d => !d.is_active).length],
            ['Economy', deals.filter(d => d.cabin_class === 'Economy' && d.is_active).length],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: '#FF5C3A' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button style={s.tab(tab === 'add')} onClick={() => { setTab('add'); setEditId(null); setForm(EMPTY_FORM); setFlightUrl(''); setAutoFilled([]); setParseMsg('') }}>
            {editId ? '✏️ Edit deal' : '➕ Add deal'}
          </button>
          <button style={s.tab(tab === 'manage')} onClick={() => setTab('manage')}>
            📋 Manage deals ({deals.filter(d => d.is_active).length} active)
          </button>
        </div>

        {message && (
          <div style={{ background: message.includes('❌') ? 'rgba(255,80,60,0.1)' : 'rgba(76,175,80,0.1)', border: `0.5px solid ${message.includes('❌') ? 'rgba(255,80,60,0.3)' : 'rgba(76,175,80,0.3)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
            {message}
          </div>
        )}

        {/* ── ADD / EDIT FORM ── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
              {editId ? 'Edit deal' : 'Add new deal'}
            </div>

            {/* ── SMART URL INPUT ── */}
            <div style={{ background: 'rgba(255,92,58,0.06)', border: '1px solid rgba(255,92,58,0.25)', borderRadius: 16, padding: '20px 20px 4px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>✈️</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700 }}>Paste Google Flights URL</span>
                <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)', fontWeight: 400 }}>— fields auto-fill instantly</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,245,236,0.45)', marginBottom: 14, lineHeight: 1.6 }}>
                Go to <strong style={{ color: 'rgba(255,245,236,0.7)' }}>google.com/travel/flights</strong>, find the deal, copy the URL from the browser bar and paste below.
              </p>
              <input
                value={flightUrl}
                onChange={handleFlightUrlChange}
                style={{ ...s.input, fontSize: 13, marginBottom: 12 }}
                placeholder="https://www.google.com/travel/flights/search?tfs=..."
              />
              {parseMsg && (
                <div style={{ fontSize: 13, color: parseMsg.includes('✅') ? '#4CAF50' : '#FF8060', marginBottom: 12, padding: '8px 12px', background: parseMsg.includes('✅') ? 'rgba(76,175,80,0.08)' : 'rgba(255,80,60,0.08)', borderRadius: 8 }}>
                  {parseMsg}
                </div>
              )}
            </div>

            {/* Route fields */}
            <div style={s.grid2}>
              <div>
                <label style={s.label}>
                  Destination city * {isAutoFilled('destination') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <input name="destination" value={form.destination} onChange={handleFormChange} style={isAutoFilled('destination') ? s.inputAuto : s.input} placeholder="e.g. Tokyo" required />
              </div>
              <div>
                <label style={s.label}>
                  Country code * {isAutoFilled('country') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <input name="country" value={form.country} onChange={handleFormChange} style={isAutoFilled('country') ? s.inputAuto : s.input} placeholder="e.g. JP" required />
              </div>
            </div>

            <div style={s.grid2}>
              <div>
                <label style={s.label}>
                  Region * {isAutoFilled('region') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <select name="region" value={form.region} onChange={handleFormChange} style={isAutoFilled('region') ? s.selectAuto : s.select}>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>
                  Origin city * {isAutoFilled('origin_city') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <select name="origin_city" value={form.origin_city} onChange={handleFormChange} style={isAutoFilled('origin_city') ? s.selectAuto : s.select}>
                  {CITIES.map(c => <option key={c} value={c}>{c} ({CITY_CODES[c]})</option>)}
                </select>
              </div>
            </div>

            <div style={s.grid3}>
              <div>
                <label style={s.label}>
                  Dest. airport code * {isAutoFilled('dest_code') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <input name="dest_code" value={form.dest_code} onChange={handleFormChange} style={isAutoFilled('dest_code') ? s.inputAuto : s.input} placeholder="e.g. NRT" required />
              </div>
              <div>
                <label style={s.label}>Airline *</label>
                <input name="airline" value={form.airline} onChange={handleFormChange} style={s.input} placeholder="e.g. IndiGo" required />
              </div>
              <div>
                <label style={s.label}>Cabin class *</label>
                <select name="cabin_class" value={form.cabin_class} onChange={handleFormChange} style={s.select}>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={s.grid3}>
              <div>
                <label style={s.label}>Deal price (₹) *</label>
                <input name="deal_price" type="number" value={form.deal_price} onChange={handleFormChange} style={s.input} placeholder="e.g. 15850" required />
              </div>
              <div>
                <label style={s.label}>Regular price (₹) *</label>
                <input name="regular_price" type="number" value={form.regular_price} onChange={handleFormChange} style={s.input} placeholder="e.g. 35000" required />
              </div>
              <div>
                <label style={s.label}>Savings % (auto-calculated)</label>
                <input name="savings_pct" type="number" value={form.savings_pct} onChange={handleFormChange} style={{ ...s.input, background: 'rgba(76,175,80,0.08)', borderColor: 'rgba(76,175,80,0.2)' }} placeholder="Auto" />
              </div>
            </div>

            <div style={s.grid3}>
              <div>
                <label style={s.label}>Stops</label>
                <select name="stops" value={form.stops} onChange={handleFormChange} style={s.select}>
                  <option value="0">Non-stop</option>
                  <option value="1">1 stop</option>
                </select>
              </div>
              <div>
                <label style={s.label}>
                  Travel dates {isAutoFilled('travel_dates') && <span style={autoTag}>✓ auto-filled</span>}
                </label>
                <input name="travel_dates" value={form.travel_dates} onChange={handleFormChange} style={isAutoFilled('travel_dates') ? s.inputAuto : s.input} placeholder="e.g. Aug–Sept 2026" />
              </div>
              <div>
                <label style={s.label}>Expires in (hours)</label>
                <select name="expires_hours" value={form.expires_hours} onChange={handleFormChange} style={s.select}>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                  <option value="96">96 hours</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            </div>

            <div>
              <label style={s.label}>
                Google Flights URL {isAutoFilled('booking_url') && <span style={autoTag}>✓ auto-filled</span>}
              </label>
              <input name="booking_url" value={form.booking_url} onChange={handleFormChange} style={isAutoFilled('booking_url') ? s.inputAuto : s.input} placeholder="https://www.google.com/travel/flights/..." />
            </div>

            <div>
              <label style={s.label}>Image URL (Unsplash)</label>
              <input name="image_url" value={form.image_url} onChange={handleFormChange} style={s.input} placeholder="https://images.unsplash.com/..." />
            </div>

            <div>
              <label style={s.label}>Description</label>
              <input name="description" value={form.description} onChange={handleFormChange} style={s.input} placeholder="e.g. Non-stop deal to Tokyo — cherry blossom season." />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={{ ...s.btn, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editId ? 'Update deal →' : 'Add deal →'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setFlightUrl(''); setAutoFilled([]); setParseMsg('') }} style={{ ...s.btn, background: 'rgba(255,255,255,0.1)' }}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        )}

        {/* ── MANAGE DEALS ── */}
        {tab === 'manage' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,245,236,0.3)' }}>Loading deals...</div>
            ) : deals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,245,236,0.3)' }}>No deals yet. Add your first deal!</div>
            ) : (
              deals.map(deal => (
                <div key={deal.id} style={{ ...s.card, opacity: deal.is_active ? 1 : 0.5 }}>
                  {deal.image_url && (
                    <img src={deal.image_url} alt={deal.destination} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700 }}>
                      {deal.origin_code} → {deal.dest_code} · {deal.destination}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.5)', marginTop: 2 }}>
                      {deal.airline} · {deal.cabin_class} · {deal.stops === 0 ? 'Non-stop' : '1 stop'} · {deal.travel_dates}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#FF5C3A' }}>
                      ₹{deal.deal_price?.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.4)' }}>
                      {deal.savings_pct}% off · ₹{deal.regular_price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => editDeal(deal)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 100, border: '0.5px solid rgba(255,255,255,0.2)', background: 'none', color: '#FFF5EC', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                    <button onClick={() => toggleActive(deal)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 100, border: 'none', background: deal.is_active ? 'rgba(255,80,60,0.15)' : 'rgba(76,175,80,0.15)', color: deal.is_active ? '#FF8060' : '#4CAF50', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      {deal.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => deleteDeal(deal.id)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 100, border: 'none', background: 'rgba(255,0,0,0.1)', color: '#FF6060', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
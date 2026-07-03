'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ORIGIN_AIRPORTS = [
  { code: 'DEL', city: 'Delhi' }, { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bangalore' }, { code: 'HYD', city: 'Hyderabad' }, { code: 'MAA', city: 'Chennai' },
]
const CABIN_CLASSES = ['All Classes', 'Economy', 'Business', 'First']
const DESTINATIONS = [
  {code:'SIN',city:'Singapore',flag:'🇸🇬'},{code:'BKK',city:'Bangkok',flag:'🇹🇭'},{code:'DPS',city:'Bali',flag:'🇮🇩'},
  {code:'KUL',city:'Kuala Lumpur',flag:'🇲🇾'},{code:'HKG',city:'Hong Kong',flag:'🇭🇰'},{code:'MNL',city:'Manila',flag:'🇵🇭'},
  {code:'SGN',city:'Ho Chi Minh City',flag:'🇻🇳'},{code:'HAN',city:'Hanoi',flag:'🇻🇳'},{code:'CGK',city:'Jakarta',flag:'🇮🇩'},
  {code:'REP',city:'Siem Reap',flag:'🇰🇭'},{code:'DAD',city:'Da Nang',flag:'🇻🇳'},{code:'RGN',city:'Yangon',flag:'🇲🇲'},
  {code:'NRT',city:'Tokyo (Narita)',flag:'🇯🇵'},{code:'HND',city:'Tokyo (Haneda)',flag:'🇯🇵'},{code:'KIX',city:'Osaka',flag:'🇯🇵'},
  {code:'FUK',city:'Fukuoka',flag:'🇯🇵'},{code:'CTS',city:'Sapporo',flag:'🇯🇵'},{code:'ICN',city:'Seoul (Incheon)',flag:'🇰🇷'},
  {code:'GMP',city:'Seoul (Gimpo)',flag:'🇰🇷'},{code:'PUS',city:'Busan',flag:'🇰🇷'},{code:'TPE',city:'Taipei',flag:'🇹🇼'},
  {code:'LHR',city:'London (Heathrow)',flag:'🇬🇧'},{code:'LGW',city:'London (Gatwick)',flag:'🇬🇧'},{code:'EDI',city:'Edinburgh',flag:'🇬🇧'},
  {code:'CDG',city:'Paris',flag:'🇫🇷'},{code:'AMS',city:'Amsterdam',flag:'🇳🇱'},{code:'FRA',city:'Frankfurt',flag:'🇩🇪'},
  {code:'MUC',city:'Munich',flag:'🇩🇪'},{code:'BER',city:'Berlin',flag:'🇩🇪'},{code:'ZRH',city:'Zurich',flag:'🇨🇭'},
  {code:'FCO',city:'Rome',flag:'🇮🇹'},{code:'MXP',city:'Milan',flag:'🇮🇹'},{code:'VCE',city:'Venice',flag:'🇮🇹'},
  {code:'BCN',city:'Barcelona',flag:'🇪🇸'},{code:'MAD',city:'Madrid',flag:'🇪🇸'},{code:'VIE',city:'Vienna',flag:'🇦🇹'},
  {code:'IST',city:'Istanbul',flag:'🇹🇷'},{code:'ATH',city:'Athens',flag:'🇬🇷'},{code:'PRG',city:'Prague',flag:'🇨🇿'},
  {code:'BUD',city:'Budapest',flag:'🇭🇺'},{code:'CPH',city:'Copenhagen',flag:'🇩🇰'},{code:'LIS',city:'Lisbon',flag:'🇵🇹'},
  {code:'DUB',city:'Dublin',flag:'🇮🇪'},{code:'BRU',city:'Brussels',flag:'🇧🇪'},{code:'WAW',city:'Warsaw',flag:'🇵🇱'},
  {code:'DXB',city:'Dubai',flag:'🇦🇪'},{code:'AUH',city:'Abu Dhabi',flag:'🇦🇪'},{code:'DOH',city:'Doha',flag:'🇶🇦'},
  {code:'MCT',city:'Muscat',flag:'🇴🇲'},{code:'RUH',city:'Riyadh',flag:'🇸🇦'},{code:'JED',city:'Jeddah',flag:'🇸🇦'},
  {code:'AMM',city:'Amman',flag:'🇯🇴'},{code:'CAI',city:'Cairo',flag:'🇪🇬'},{code:'TLV',city:'Tel Aviv',flag:'🇮🇱'},
  {code:'JFK',city:'New York (JFK)',flag:'🇺🇸'},{code:'LAX',city:'Los Angeles',flag:'🇺🇸'},{code:'SFO',city:'San Francisco',flag:'🇺🇸'},
  {code:'ORD',city:'Chicago',flag:'🇺🇸'},{code:'MIA',city:'Miami',flag:'🇺🇸'},{code:'SEA',city:'Seattle',flag:'🇺🇸'},
  {code:'BOS',city:'Boston',flag:'🇺🇸'},{code:'LAS',city:'Las Vegas',flag:'🇺🇸'},
  {code:'YYZ',city:'Toronto',flag:'🇨🇦'},{code:'YVR',city:'Vancouver',flag:'🇨🇦'},{code:'YUL',city:'Montreal',flag:'🇨🇦'},
  {code:'SYD',city:'Sydney',flag:'🇦🇺'},{code:'MEL',city:'Melbourne',flag:'🇦🇺'},{code:'BNE',city:'Brisbane',flag:'🇦🇺'},
  {code:'AKL',city:'Auckland',flag:'🇳🇿'},{code:'NAN',city:'Fiji (Nadi)',flag:'🇫🇯'},
  {code:'NBO',city:'Nairobi',flag:'🇰🇪'},{code:'CPT',city:'Cape Town',flag:'🇿🇦'},{code:'JNB',city:'Johannesburg',flag:'🇿🇦'},
  {code:'MLE',city:'Maldives (Malé)',flag:'🇲🇻'},{code:'SEZ',city:'Seychelles',flag:'🇸🇨'},{code:'MRU',city:'Mauritius',flag:'🇲🇺'},
  {code:'GRU',city:'São Paulo',flag:'🇧🇷'},{code:'EZE',city:'Buenos Aires',flag:'🇦🇷'},{code:'SCL',city:'Santiago',flag:'🇨🇱'},
]

function PreferencesContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const isNew        = searchParams.get('new') === 'true'
  const isSignup     = searchParams.get('from') === 'signup'

  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [prefs, setPrefs]   = useState({
    phone: '', whatsapp_opted_in: false,
    preferred_destinations: [], other_destination: '',
    preferred_origins: [], preferred_class: 'All Classes',
  })
  const [showOther, setShowOther] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { router.push('/login'); return }
      setUser(session.user); loadPrefs(session.user.id)
    })
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function loadPrefs(userId) {
    const { data } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single()
    if (data) {
      setPrefs({ phone: data.phone||'', whatsapp_opted_in: data.whatsapp_opted_in||false, preferred_destinations: data.preferred_destinations||[], other_destination: data.other_destination||'', preferred_origins: data.preferred_origins||[], preferred_class: data.preferred_class||'All Classes' })
      if (data.other_destination) setShowOther(true)
    }
    setLoading(false)
  }

  function toggleDestination(code) { setPrefs(p => ({ ...p, preferred_destinations: p.preferred_destinations.includes(code) ? p.preferred_destinations.filter(c=>c!==code) : [...p.preferred_destinations, code] })) }
  function toggleOrigin(code) { setPrefs(p => ({ ...p, preferred_origins: p.preferred_origins.includes(code) ? p.preferred_origins.filter(c=>c!==code) : [...p.preferred_origins, code] })) }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    await supabase.from('user_preferences').upsert({ user_id: user.id, phone: prefs.phone||null, whatsapp_opted_in: prefs.whatsapp_opted_in, preferred_destinations: prefs.preferred_destinations, other_destination: prefs.other_destination||null, preferred_origins: prefs.preferred_origins, preferred_class: prefs.preferred_class, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSaving(false)
    router.push(isNew ? '/deals' : isSignup ? '/' : '/deals')
  }

  const filteredDests = DESTINATIONS.filter(d => d.city.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.toLowerCase().includes(searchQuery.toLowerCase()))
  const selectedDests = DESTINATIONS.filter(d => prefs.preferred_destinations.includes(d.code))

  if (loading) return <div style={{ minHeight:'100vh', background:'#0D0A08', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFF5EC', fontFamily:"'DM Sans', sans-serif" }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:100px; font-size:13px; cursor:pointer; border:0.5px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.06); color:rgba(255,245,236,0.6); transition:all 0.15s; }
        .chip:hover { border-color:rgba(255,92,58,0.4); color:#FFF5EC; }
        .chip.selected { background:rgba(255,92,58,0.15); border-color:rgba(255,92,58,0.5); color:#FF8060; }
        .dest-row { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; transition:background 0.15s; }
        .dest-row:hover { background:rgba(255,255,255,0.06); }
        .dest-row.sel { background:rgba(255,92,58,0.1); }
      `}</style>

      {/* Fixed orbs */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter:'blur(100px)', opacity:0.15, top:-150, right:-100 }}/>
      </div>

      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:64, background:'rgba(13,10,8,0.9)', backdropFilter:'blur(20px)', borderBottom:'0.5px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:800, color:'#FFF5EC', textDecoration:'none' }}>Yolo<span style={{ color:'#FF5C3A' }}>Fare</span></Link>
        {!isNew && !isSignup && <Link href="/deals" style={{ fontSize:13, color:'rgba(255,245,236,0.5)', textDecoration:'none' }}>← Back to deals</Link>}
      </nav>

      <div style={{ position:'relative', zIndex:1, maxWidth:680, margin:'0 auto', padding:'48px 24px 80px' }}>

        {/* ── CONGRATULATIONS banner (only on ?new=true) ── */}
        {isNew && (
          <div style={{ background:'linear-gradient(135deg, rgba(255,92,58,0.12) 0%, rgba(255,92,58,0.05) 100%)', border:'1px solid rgba(255,92,58,0.3)', borderRadius:24, padding:'32px 28px', marginBottom:40, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:28, fontWeight:800, letterSpacing:-1, marginBottom:12, lineHeight:1.1 }}>
              Welcome to YoloFare Pro!
            </h1>
            <p style={{ fontSize:16, color:'rgba(255,245,236,0.65)', fontWeight:300, lineHeight:1.7, maxWidth:460, margin:'0 auto' }}>
              Your next international trip is not far away — just answer a few questions so we can send you only the deals that matter to you.
            </p>
          </div>
        )}

        {/* ── SIGNUP welcome banner ── */}
        {isSignup && (
          <div style={{ background:'linear-gradient(135deg, rgba(255,92,58,0.1) 0%, rgba(255,92,58,0.03) 100%)', border:'1px solid rgba(255,92,58,0.25)', borderRadius:24, padding:'32px 28px', marginBottom:40, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✈️</div>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:28, fontWeight:800, letterSpacing:-1, marginBottom:12, lineHeight:1.1 }}>
              One last step
            </h1>
            <p style={{ fontSize:16, color:'rgba(255,245,236,0.65)', fontWeight:300, lineHeight:1.7, maxWidth:460, margin:'0 auto' }}>
              Tell us where you want to fly so we can show you deals that actually matter to you. Takes 30 seconds.
            </p>
          </div>
        )}

        {!isNew && !isSignup && (
          <div style={{ marginBottom:40 }}>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:32, fontWeight:800, letterSpacing:-1.5, marginBottom:8 }}>Your preferences ✈️</h1>
            <p style={{ fontSize:15, color:'rgba(255,245,236,0.5)', fontWeight:300, lineHeight:1.7 }}>Tell us where you want to fly — we'll only send deals that matter to you.</p>
          </div>
        )}

        {/* Phone + WhatsApp */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'24px 28px', marginBottom:20 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, marginBottom:4 }}>📱 WhatsApp alerts</div>
          <p style={{ fontSize:13, color:'rgba(255,245,236,0.45)', marginBottom:20, lineHeight:1.6 }}>Get instant deal alerts on WhatsApp. Optional.</p>
          <label style={{ display:'block', fontSize:11, color:'rgba(255,245,236,0.4)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>Phone number (with country code)</label>
          <input type="tel" value={prefs.phone} onChange={e=>setPrefs(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:12, color:'#FFF5EC', fontFamily:"'DM Sans', sans-serif", fontSize:15, outline:'none', marginBottom:16, boxSizing:'border-box' }}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'14px 18px' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>Opt in to WhatsApp alerts</div>
              <div style={{ fontSize:12, color:'rgba(255,245,236,0.4)' }}>We'll message you when a deal matches your wishlist</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:48, height:26, flexShrink:0 }}>
              <input type="checkbox" checked={prefs.whatsapp_opted_in} onChange={e=>setPrefs(p=>({...p,whatsapp_opted_in:e.target.checked}))} style={{ opacity:0, width:0, height:0 }}/>
              <span style={{ position:'absolute', cursor:'pointer', inset:0, background:prefs.whatsapp_opted_in?'#25D366':'rgba(255,255,255,0.15)', borderRadius:26, transition:'0.3s' }}>
                <span style={{ position:'absolute', height:20, width:20, left:prefs.whatsapp_opted_in?24:3, bottom:3, background:'white', borderRadius:'50%', transition:'0.3s' }}/>
              </span>
            </label>
          </div>
        </div>

        {/* Destinations */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'24px 28px', marginBottom:20 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, marginBottom:4 }}>🌍 Destination wishlist</div>
          <p style={{ fontSize:13, color:'rgba(255,245,236,0.45)', marginBottom:20, lineHeight:1.6 }}>Select destinations you'd love to visit. We'll alert you when deals drop for these.</p>
          {prefs.preferred_destinations.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
              {selectedDests.map(d => <span key={d.code} className="chip selected" onClick={()=>toggleDestination(d.code)}>{d.flag} {d.city} <span style={{opacity:0.6,fontSize:11}}>✕</span></span>)}
              {prefs.other_destination && <span className="chip selected" onClick={()=>{setShowOther(false);setPrefs(p=>({...p,other_destination:''}));}}>📍 {prefs.other_destination} <span style={{opacity:0.6,fontSize:11}}>✕</span></span>}
            </div>
          )}
          <div ref={dropdownRef} style={{ position:'relative' }}>
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>setDropdownOpen(true)} placeholder="🔍  Search destinations..." style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:12, color:'#FFF5EC', fontFamily:"'DM Sans', sans-serif", fontSize:14, outline:'none', boxSizing:'border-box' }}/>
            {dropdownOpen && (
              <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:50, background:'#1a1410', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:14, marginTop:6, maxHeight:280, overflowY:'auto', boxShadow:'0 16px 40px rgba(0,0,0,0.5)' }}>
                {filteredDests.map(d => (
                  <div key={d.code} className={`dest-row ${prefs.preferred_destinations.includes(d.code)?'sel':''}`} onClick={()=>{toggleDestination(d.code);setSearchQuery('')}}>
                    <span style={{fontSize:20}}>{d.flag}</span>
                    <div style={{flex:1}}><span style={{fontSize:14,fontWeight:500,color:'#FFF5EC'}}>{d.city}</span><span style={{fontSize:12,color:'rgba(255,245,236,0.4)',marginLeft:8}}>{d.code}</span></div>
                    {prefs.preferred_destinations.includes(d.code) && <span style={{color:'#FF5C3A',fontSize:14}}>✓</span>}
                  </div>
                ))}
                <div className={`dest-row ${showOther?'sel':''}`} onClick={()=>{setShowOther(v=>!v);setDropdownOpen(false);setSearchQuery('')}}>
                  <span style={{fontSize:20}}>📍</span>
                  <div style={{flex:1}}><span style={{fontSize:14,fontWeight:500,color:'#FFF5EC'}}>Other destination</span><span style={{fontSize:12,color:'rgba(255,245,236,0.4)',marginLeft:8}}>Type your own</span></div>
                  {showOther && <span style={{color:'#FF5C3A',fontSize:14}}>✓</span>}
                </div>
              </div>
            )}
          </div>
          {showOther && <input type="text" value={prefs.other_destination} onChange={e=>setPrefs(p=>({...p,other_destination:e.target.value}))} placeholder="e.g. Reykjavik, Iceland" style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,92,58,0.3)', borderRadius:12, color:'#FFF5EC', fontFamily:"'DM Sans', sans-serif", fontSize:14, outline:'none', marginTop:12, boxSizing:'border-box' }} autoFocus/>}
          {prefs.preferred_destinations.length===0 && !showOther && <p style={{fontSize:12,color:'rgba(255,245,236,0.3)',marginTop:10,marginBottom:0}}>No destinations selected — you'll receive alerts for all deals.</p>}
        </div>

        {/* Departure airports */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'24px 28px', marginBottom:20 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, marginBottom:4 }}>🛫 Preferred departure cities</div>
          <p style={{ fontSize:13, color:'rgba(255,245,236,0.45)', marginBottom:20, lineHeight:1.6 }}>Which cities do you usually fly from?</p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {ORIGIN_AIRPORTS.map(a => <div key={a.code} className={`chip ${prefs.preferred_origins.includes(a.code)?'selected':''}`} style={{padding:'10px 18px',borderRadius:12,fontSize:14}} onClick={()=>toggleOrigin(a.code)}>{a.city} <span style={{fontSize:12,opacity:0.6}}>({a.code})</span></div>)}
          </div>
        </div>

        {/* Cabin class */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'24px 28px', marginBottom:32 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, marginBottom:4 }}>💺 Preferred cabin class</div>
          <p style={{ fontSize:13, color:'rgba(255,245,236,0.45)', marginBottom:20, lineHeight:1.6 }}>Which class do you usually fly?</p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {CABIN_CLASSES.map(c => <div key={c} className={`chip ${prefs.preferred_class===c?'selected':''}`} style={{padding:'10px 18px',borderRadius:12,fontSize:14}} onClick={()=>setPrefs(p=>({...p,preferred_class:c}))}>{c==='All Classes'?'✈️ All Classes':c==='Economy'?'🟢 Economy':c==='Business'?'🟡 Business':'⭐ First'}</div>)}
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{ width:'100%', background:'#FF5C3A', color:'white', border:'none', padding:'16px', borderRadius:100, fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, cursor:saving?'not-allowed':'pointer', opacity:saving?0.8:1 }}>
          {saving ? 'Saving...' : isNew ? 'Save & see my deals →' : isSignup ? 'Let\'s go →' : 'Save preferences →'}
        </button>
        {isNew && <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,245,236,0.3)', marginTop:12 }}>You can update these anytime from your account settings.</p>}
      </div>
    </div>
  )
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#0D0A08', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFF5EC', fontFamily:"'DM Sans', sans-serif" }}>Loading...</div>}>
      <PreferencesContent />
    </Suspense>
  )
}

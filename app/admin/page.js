'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const ADMIN_PASSWORD = 'yolofare@admin2026'
const REGIONS = ['South East Asia', 'Europe', 'USA', 'Canada', 'Middle East', 'Oceania', 'Australia']
const CLASSES = ['Economy', 'Business', 'First']
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai']
const CITY_CODES = { 'Delhi': 'DEL', 'Mumbai': 'BOM', 'Bangalore': 'BLR', 'Hyderabad': 'HYD', 'Chennai': 'MAA' }

const AIRPORT_MAP = {
  SIN:{city:'Singapore',country:'SG',region:'South East Asia'},BKK:{city:'Bangkok',country:'TH',region:'South East Asia'},
  DPS:{city:'Bali',country:'ID',region:'South East Asia'},KUL:{city:'Kuala Lumpur',country:'MY',region:'South East Asia'},
  HKG:{city:'Hong Kong',country:'HK',region:'South East Asia'},MNL:{city:'Manila',country:'PH',region:'South East Asia'},
  SGN:{city:'Ho Chi Minh City',country:'VN',region:'South East Asia'},ICN:{city:'Seoul',country:'KR',region:'South East Asia'},
  NRT:{city:'Tokyo',country:'JP',region:'South East Asia'},HND:{city:'Tokyo',country:'JP',region:'South East Asia'},
  KIX:{city:'Osaka',country:'JP',region:'South East Asia'},TPE:{city:'Taipei',country:'TW',region:'South East Asia'},
  CGK:{city:'Jakarta',country:'ID',region:'South East Asia'},
  LHR:{city:'London',country:'GB',region:'Europe'},CDG:{city:'Paris',country:'FR',region:'Europe'},
  AMS:{city:'Amsterdam',country:'NL',region:'Europe'},FRA:{city:'Frankfurt',country:'DE',region:'Europe'},
  MUC:{city:'Munich',country:'DE',region:'Europe'},ZRH:{city:'Zurich',country:'CH',region:'Europe'},
  FCO:{city:'Rome',country:'IT',region:'Europe'},BCN:{city:'Barcelona',country:'ES',region:'Europe'},
  MAD:{city:'Madrid',country:'ES',region:'Europe'},VIE:{city:'Vienna',country:'AT',region:'Europe'},
  IST:{city:'Istanbul',country:'TR',region:'Europe'},
  DXB:{city:'Dubai',country:'AE',region:'Middle East'},AUH:{city:'Abu Dhabi',country:'AE',region:'Middle East'},
  DOH:{city:'Doha',country:'QA',region:'Middle East'},MCT:{city:'Muscat',country:'OM',region:'Middle East'},
  JFK:{city:'New York',country:'US',region:'USA'},LAX:{city:'Los Angeles',country:'US',region:'USA'},
  SFO:{city:'San Francisco',country:'US',region:'USA'},
  YYZ:{city:'Toronto',country:'CA',region:'Canada'},YVR:{city:'Vancouver',country:'CA',region:'Canada'},
  SYD:{city:'Sydney',country:'AU',region:'Australia'},MEL:{city:'Melbourne',country:'AU',region:'Australia'},
  AKL:{city:'Auckland',country:'NZ',region:'Oceania'},
  DEL:{city:'Delhi',country:'IN',region:null},BOM:{city:'Mumbai',country:'IN',region:null},
  BLR:{city:'Bangalore',country:'IN',region:null},HYD:{city:'Hyderabad',country:'IN',region:null},
  MAA:{city:'Chennai',country:'IN',region:null},
}
const INDIAN_CODES = new Set(['DEL','BOM','BLR','HYD','MAA'])
const MONTHS = {'01':'January','02':'February','03':'March','04':'April','05':'May','06':'June','07':'July','08':'August','09':'September','10':'October','11':'November','12':'December'}

function parseGoogleFlightsUrl(url) {
  const result = { autoFilled: [] }
  try {
    const urlObj = new URL(url)
    const tfs = urlObj.searchParams.get('tfs')
    if (!tfs) return result
    const b64 = tfs.replace(/-/g,'+').replace(/_/g,'/')
    const padded = b64 + '=='.slice((b64.length*6)%8/2)
    const binary = atob(padded)
    const dateMatch = binary.match(/(\d{4}-\d{2}-\d{2})/)
    if (dateMatch) {
      const [year,month] = dateMatch[1].split('-')
      result.travel_dates = `${MONTHS[month]} ${year}`
      result.autoFilled.push('travel_dates')
    }
    const foundCodes = []
    for (let i=0;i<binary.length-2;i++) {
      const c0=binary.charCodeAt(i),c1=binary.charCodeAt(i+1),c2=binary.charCodeAt(i+2)
      if(c0>=65&&c0<=90&&c1>=65&&c1<=90&&c2>=65&&c2<=90){const code=binary.slice(i,i+3);if(AIRPORT_MAP[code])foundCodes.push(code)}
    }
    const unique=[...new Set(foundCodes)]
    const origins=unique.filter(c=>INDIAN_CODES.has(c))
    const dests=unique.filter(c=>!INDIAN_CODES.has(c))
    if(origins.length>0){result.origin_code=origins[0];const info=AIRPORT_MAP[origins[0]];if(info){result.origin_city=info.city;result.autoFilled.push('origin_code','origin_city')}}
    if(dests.length>0){result.dest_code=dests[0];const info=AIRPORT_MAP[dests[0]];if(info){result.destination=info.city;result.country=info.country;result.region=info.region||'South East Asia';result.autoFilled.push('dest_code','destination','country','region')}}
  } catch(e){}
  return result
}

const EMPTY_FORM = {
  destination:'',country:'',region:'South East Asia',origin_city:'Delhi',origin_code:'DEL',dest_code:'',
  airline:'',cabin_class:'Economy',deal_price:'',regular_price:'',savings_pct:'',
  stops:'0',travel_dates:'',booking_url:'',image_url:'',description:'',expires_hours:'48',is_free_preview:false
}

export default function AdminPage() {
  const [authed,setAuthed]               = useState(false)
  const [password,setPassword]           = useState('')
  const [pwError,setPwError]             = useState('')
  const [deals,setDeals]                 = useState([])
  const [loading,setLoading]             = useState(false)
  const [form,setForm]                   = useState(EMPTY_FORM)
  const [saving,setSaving]               = useState(false)
  const [message,setMessage]             = useState('')
  const [tab,setTab]                     = useState('add')
  const [editId,setEditId]               = useState(null)
  const [flightUrl,setFlightUrl]         = useState('')
  const [autoFilled,setAutoFilled]       = useState([])
  const [parseMsg,setParseMsg]           = useState('')
  const [sendingDealId,setSendingDealId] = useState(null)
  const [alertResults,setAlertResults]   = useState({})
  const [subscribers,setSubscribers]     = useState([])
  const [subsLoading,setSubsLoading]     = useState(false)
  const [destFilter,setDestFilter]       = useState('')

  useEffect(()=>{const saved=localStorage.getItem('yf_admin_auth');if(saved==='true')setAuthed(true)},[])
  useEffect(()=>{if(authed)fetchDeals()},[authed])

  function handleLogin(e){e.preventDefault();if(password===ADMIN_PASSWORD){setAuthed(true);localStorage.setItem('yf_admin_auth','true')}else setPwError('Wrong password')}
  async function fetchDeals(){setLoading(true);const{data}=await supabase.from('deals').select('*').order('created_at',{ascending:false});if(data)setDeals(data);setLoading(false)}

  async function fetchSubscribers() {
    setSubsLoading(true)
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ADMIN_PASSWORD })
      })
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    } catch(e) {
      setSubscribers([])
    }
    setSubsLoading(false)
  }

  function handleFlightUrlChange(e){
    const url=e.target.value;setFlightUrl(url);setParseMsg('');setAutoFilled([])
    if(!url.includes('google.com/travel/flights'))return
    const parsed=parseGoogleFlightsUrl(url)
    if(parsed.autoFilled.length===0){setParseMsg('⚠️ Could not extract — fill manually.');setForm(f=>({...f,booking_url:url}));return}
    setForm(f=>({...f,booking_url:url,dest_code:parsed.dest_code||f.dest_code,destination:parsed.destination||f.destination,country:parsed.country||f.country,region:parsed.region||f.region,origin_code:parsed.origin_code||f.origin_code,origin_city:parsed.origin_city||f.origin_city,travel_dates:parsed.travel_dates||f.travel_dates}))
    setAutoFilled(parsed.autoFilled);setParseMsg(`✅ Auto-filled ${parsed.autoFilled.length} fields.`)
  }

  function handleFormChange(e){
    const{name,value,type,checked}=e.target
    const updated={...form,[name]:type==='checkbox'?checked:value}
    if(name==='deal_price'||name==='regular_price'){const d=parseFloat(name==='deal_price'?value:form.deal_price);const r=parseFloat(name==='regular_price'?value:form.regular_price);if(d&&r&&r>d)updated.savings_pct=Math.round(((r-d)/r)*100).toString()}
    if(name==='origin_city')updated.origin_code=CITY_CODES[value]||''
    setForm(updated)
  }

  async function handleSubmit(e){
    e.preventDefault();setSaving(true);setMessage('')
    const expiresAt=new Date(Date.now()+parseInt(form.expires_hours)*3600000).toISOString()
    const dealData={destination:form.destination,country:form.country,region:form.region,origin_city:form.origin_city,origin_code:form.origin_code,dest_code:form.dest_code.toUpperCase(),airline:form.airline,cabin_class:form.cabin_class,deal_price:parseInt(form.deal_price),regular_price:parseInt(form.regular_price),savings_pct:parseInt(form.savings_pct),stops:parseInt(form.stops),travel_dates:form.travel_dates,booking_url:form.booking_url,image_url:form.image_url,description:form.description,is_active:true,expires_at:expiresAt,is_free_preview:form.is_free_preview}
    let error
    if(editId){const res=await supabase.from('deals').update(dealData).eq('id',editId);error=res.error}
    else{const res=await supabase.from('deals').insert(dealData);error=res.error}
    if(error){setMessage(`❌ Error: ${error.message}`)}
    else{setMessage(editId?'✅ Deal updated!':'✅ Deal added!');setForm(EMPTY_FORM);setFlightUrl('');setAutoFilled([]);setParseMsg('');setEditId(null);fetchDeals();setTab('manage')}
    setSaving(false)
  }

  async function toggleActive(deal){await supabase.from('deals').update({is_active:!deal.is_active}).eq('id',deal.id);fetchDeals()}

  async function toggleFreePreview(deal){
    const turningOn=!deal.is_free_preview
    const currentFreeCount=deals.filter(d=>d.is_free_preview&&d.id!==deal.id).length
    if(turningOn&&currentFreeCount>=3){setMessage('⚠️ Max 3 free preview deals. Remove one first.');setTimeout(()=>setMessage(''),3000);return}
    await supabase.from('deals').update({is_free_preview:!deal.is_free_preview}).eq('id',deal.id);fetchDeals()
  }

  async function deleteDeal(id){if(!confirm('Delete this deal permanently?'))return;await supabase.from('deals').delete().eq('id',id);fetchDeals()}

  function editDeal(deal){
    setForm({destination:deal.destination||'',country:deal.country||'',region:deal.region||'South East Asia',origin_city:deal.origin_city||'Delhi',origin_code:deal.origin_code||'DEL',dest_code:deal.dest_code||'',airline:deal.airline||'',cabin_class:deal.cabin_class||'Economy',deal_price:deal.deal_price?.toString()||'',regular_price:deal.regular_price?.toString()||'',savings_pct:deal.savings_pct?.toString()||'',stops:deal.stops?.toString()||'0',travel_dates:deal.travel_dates||'',booking_url:deal.booking_url||'',image_url:deal.image_url||'',description:deal.description||'',expires_hours:'48',is_free_preview:deal.is_free_preview||false})
    setFlightUrl(deal.booking_url||'');setAutoFilled([]);setParseMsg('');setEditId(deal.id);setTab('add');window.scrollTo(0,0)
  }

  async function sendDealAlert(deal) {
    if (!confirm(`Send alert for this deal to all matching Pro subscribers?\n\n${deal.origin_code} → ${deal.dest_code} · ${deal.destination}\n₹${deal.deal_price?.toLocaleString('en-IN')} · ${deal.savings_pct}% off`)) return
    setSendingDealId(deal.id)
    try {
      const res = await fetch('/api/send-alerts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ secret: 'yolofare-cron-2026', dealId: deal.id }) })
      const data = await res.json()
      setAlertResults(prev => ({ ...prev, [deal.id]: { ...data, sentAt: new Date().toLocaleTimeString() } }))
    } catch (err) {
      setAlertResults(prev => ({ ...prev, [deal.id]: { error: err.message } }))
    }
    setSendingDealId(null)
  }

  const isAF=(f)=>autoFilled.includes(f)
  const aTag={fontSize:10,color:'#4CAF50',fontWeight:600,marginLeft:6}
  const freeCount=deals.filter(d=>d.is_free_preview).length

  const s={
    page:{minHeight:'100vh',background:'#0D0A08',color:'#FFF5EC',fontFamily:"'DM Sans',sans-serif",padding:'0 0 80px'},
    nav:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 40px',height:60,background:'rgba(255,255,255,0.05)',borderBottom:'0.5px solid rgba(255,255,255,0.1)'},
    logo:{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:'#FFF5EC',textDecoration:'none'},
    wrap:{maxWidth:920,margin:'0 auto',padding:'40px 24px'},
    label:{display:'block',fontSize:11,color:'rgba(255,245,236,0.4)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:8},
    input:{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(255,255,255,0.15)',borderRadius:10,color:'#FFF5EC',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none',marginBottom:16,boxSizing:'border-box'},
    inputAuto:{width:'100%',padding:'12px 14px',background:'rgba(76,175,80,0.07)',border:'0.5px solid rgba(76,175,80,0.35)',borderRadius:10,color:'#FFF5EC',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none',marginBottom:16,boxSizing:'border-box'},
    select:{width:'100%',padding:'12px 14px',background:'#1a1410',border:'0.5px solid rgba(255,255,255,0.15)',borderRadius:10,color:'#FFF5EC',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none',marginBottom:16},
    selectAuto:{width:'100%',padding:'12px 14px',background:'rgba(76,175,80,0.07)',border:'0.5px solid rgba(76,175,80,0.35)',borderRadius:10,color:'#FFF5EC',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none',marginBottom:16},
    btn:{background:'#FF5C3A',color:'white',border:'none',padding:'12px 28px',borderRadius:100,fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer'},
    card:{background:'rgba(255,255,255,0.05)',borderRadius:16,padding:'16px 20px',marginBottom:12},
    grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 20px'},
    grid3:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0 20px'},
    tab:(active)=>({padding:'10px 20px',borderRadius:100,fontSize:13,cursor:'pointer',border:'none',fontFamily:"'DM Sans',sans-serif",background:active?'#FF5C3A':'rgba(255,255,255,0.07)',color:active?'white':'rgba(255,245,236,0.55)'}),
  }

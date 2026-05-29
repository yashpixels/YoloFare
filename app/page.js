import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.25, top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, bottom: '10%', left: -150 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
            <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, letterSpacing: -3, lineHeight: 0.95, marginBottom: 24 }}>
          Fly abroad for less<br/>than a <span style={{ fontStyle: 'italic', color: '#FF5C3A', fontFamily: 'Georgia, serif', fontWeight: 400 }}>domestic</span> trip.
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(255,245,236,0.55)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.65, fontWeight: 300 }}>
          Handpicked flight deals from India. 40% off minimum. Economy, Business and First Class.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/deals" style={{ background: '#FF5C3A', color: 'white', padding: '16px 32px', borderRadius: 100, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Browse deals →
          </Link>
          <Link href="/deals" style={{ background: 'rgba(255,255,255,0.07)', color: '#FFF5EC', padding: '16px 32px', borderRadius: 100, fontSize: 16, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.12)' }}>
            How it works
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
          {[['2,400+', 'Active members'], ['₹18k+', 'Avg. savings'], ['40–90%', 'Off regular fares'], ['5 cities', 'DEL·BOM·BLR·HYD·MAA']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: -1, color: '#FF5C3A' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
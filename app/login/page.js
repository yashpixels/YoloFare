'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'http://localhost:3000/deals' }
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.15, bottom: '10%', left: -100 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="rgba(255,92,58,0.15)" stroke="rgba(255,92,58,0.4)" strokeWidth="0.5"/>
              <path d="M7 22 L13 10 L18 18 L22 13 L29 22" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="29" cy="22" r="2.5" fill="#FF5C3A"/>
            </svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#FFF5EC' }}>Yolo<span style={{ color: '#FF5C3A' }}>Fare</span></span>
          </Link>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 36, backdropFilter: 'blur(20px)' }}>
          {!sent ? (
            <>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>Welcome back</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', marginBottom: 32, fontWeight: 300 }}>Enter your email and we'll send you a magic link to sign in.</p>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none' }}
                  />
                </div>

                {error && <div style={{ fontSize: 13, color: '#FF8060', marginBottom: 16 }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#FF5C3A', color: 'white', border: 'none', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending...' : 'Send magic link →'}
                </button>
              </form>

              <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,92,58,0.06)', borderRadius: 12, border: '0.5px solid rgba(255,92,58,0.15)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.5)', textAlign: 'center', lineHeight: 1.6 }}>
                  New to YoloFare? Just enter your email above — we'll create your account automatically.
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 }}>Check your inbox!</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
                We sent a magic link to <strong style={{ color: '#FFF5EC' }}>{email}</strong>. Click it to sign in instantly — no password needed.
              </p>
              <button onClick={() => setSent(false)} style={{ fontSize: 13, color: '#FF5C3A', background: 'none', border: 'none', cursor: 'pointer' }}>
                Use a different email
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', textDecoration: 'none' }}>
            ← Back to deals
          </Link>
        </div>
      </div>
    </div>
  )
}
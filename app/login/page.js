'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackLead, trackCompleteRegistration } from '../../lib/pixel.js'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/deals'

  const [mode, setMode]         = useState('magic')  // 'magic' | 'password'
  const [authType, setAuthType] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')
  const [error, setError]       = useState('')

  async function handleMagicLink(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `https://www.yolofare.com/auth/callback?next=${encodeURIComponent(next)}` }
    })
    if (error) setError(error.message)
    else { setMessage('✅ Magic link sent! Check your inbox — and your spam/junk folder if you don\'t see it.'); trackLead(email); }
    setLoading(false)
  }

  async function handlePassword(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    if (authType === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else { setMessage('✅ Account created! Check your email to confirm, then sign in.'); trackCompleteRegistration(); }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else window.location.href = next
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `https://www.yolofare.com/auth/callback?next=${encodeURIComponent(next)}` }
    })
    if (error) { setError(error.message); setLoading(false) }
  }
  const inp = { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Orb */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15, top: -150, right: -100 }} />
      </div>

      {/* Logo */}
      <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#FFF5EC', textDecoration: 'none', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        Yolo<span style={{ color: '#FF5C3A' }}>Fare</span>
      </Link>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, position: 'relative', zIndex: 1 }}>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
          {mode === 'magic' ? 'Welcome back' : authType === 'signup' ? 'Create account' : 'Sign in'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,245,236,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
          {mode === 'magic'
            ? "Enter your email and we'll send you a magic link to sign in."
            : authType === 'signup'
            ? 'Create your YoloFare account with email and password.'
            : 'Sign in with your email and password.'}
        </p>

        {/* Google SSO */}
        <button onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px', cursor: 'pointer', marginBottom: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#FFF5EC' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }}/>
          <span style={{ fontSize: 12, color: 'rgba(255,245,236,0.3)' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }}/>
        </div>
        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 3, marginBottom: 24, gap: 3 }}>
          {[['magic', '✉️ Magic link'], ['password', '🔑 Password']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, background: mode === m ? 'rgba(255,255,255,0.12)' : 'transparent', color: mode === m ? '#FFF5EC' : 'rgba(255,245,236,0.45)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Magic link form */}
        {mode === 'magic' && (
          <form onSubmit={handleMagicLink}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="you@example.com" required autoFocus />
            {error   && <div style={{ color: '#FF8060', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            {message && <div style={{ color: '#4CAF50', fontSize: 13, marginBottom: 12 }}>{message}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#FF5C3A', color: 'white', border: 'none', padding: '14px', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending...' : 'Send magic link →'}
            </button>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, fontSize: 13, color: 'rgba(255,245,236,0.45)', textAlign: 'center' }}>
              New to YoloFare? Just enter your email above — we'll create your account automatically.
            </div>
          </form>
        )}

        {/* Email + Password form */}
        {mode === 'password' && (
          <form onSubmit={handlePassword}>
            {/* Sign in / Sign up toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[['signin', 'Sign in'], ['signup', 'Sign up']].map(([t, label]) => (
                <button key={t} type="button" onClick={() => { setAuthType(t); setError(''); setMessage('') }} style={{ flex: 1, padding: '8px', borderRadius: 10, border: `0.5px solid ${authType === t ? 'rgba(255,92,58,0.5)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, background: authType === t ? 'rgba(255,92,58,0.1)' : 'transparent', color: authType === t ? '#FF8060' : 'rgba(255,245,236,0.45)' }}>
                  {label}
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="you@example.com" required autoFocus />

            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} placeholder={authType === 'signup' ? 'Create a password (min 6 chars)' : 'Your password'} required minLength={6} />

            {error   && <div style={{ color: '#FF8060', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            {message && <div style={{ color: '#4CAF50', fontSize: 13, marginBottom: 12 }}>{message}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', background: '#FF5C3A', color: 'white', border: 'none', padding: '14px', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? 'Please wait...' : authType === 'signup' ? 'Create account →' : 'Sign in →'}
            </button>
          </form>
        )}

      </div>

      <Link href="/deals" style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,245,236,0.3)', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
        ← Back to deals
      </Link>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0D0A08' }} />}>
      <LoginContent />
    </Suspense>
  )
}

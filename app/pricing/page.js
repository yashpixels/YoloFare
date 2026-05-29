'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handlePayment() {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(true)

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: 99900,
      currency: 'INR',
      name: 'YoloFare',
      description: 'YoloFare Pro — Monthly Subscription',
      image: 'https://yolofare.com/favicon.ico',
      handler: async function(response) {
        const { error } = await supabase.from('subscriptions').upsert({
          user_id: user.id,
          plan: 'pro',
          razorpay_subscription_id: response.razorpay_payment_id,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        if (!error) {
          window.location.href = '/deals?upgraded=true'
        }
      },
      prefill: {
        email: user?.email || '',
      },
      theme: {
        color: '#FF5C3A'
      },
      modal: {
        ondismiss: function() {
          setLoading(false)
        }
      }
    }

    if (typeof window !== 'undefined' && window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } else {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    }
    setLoading(false)
  }

  const freeFeatures = [
    '3 flight deals per day',
    'South East Asia deals only',
    'Economy class deals',
    'Email notifications',
  ]

  const proFeatures = [
    'All deals unlocked — 20+ per day',
    'All regions — Europe, USA, Middle East & more',
    'Economy, Business & First Class deals',
    'Early access — 2 hours before free users',
    'WhatsApp deal alerts',
    'Price history & savings analytics',
    'Priority support',
    'Cancel anytime',
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #E03A1A 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.15, bottom: '10%', left: -150 }} />
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
            <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)' }}>👋 {user.email}</span>
          ) : (
            <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none' }}>Login</Link>
          )}
          <Link href="/deals" style={{ fontSize: 13, color: 'rgba(255,245,236,0.55)', textDecoration: 'none' }}>Browse deals</Link>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '72px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,92,58,0.1)', border: '0.5px solid rgba(255,92,58,0.25)', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: '#FF8060', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
            Simple pricing
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
            One plan. All deals.<br/>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: '#FF5C3A' }}>Zero compromises.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,245,236,0.55)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65, fontWeight: 300 }}>
            The average YoloFare Pro member saves ₹18,000+ per trip. At ₹999/mo that's 18x ROI on your first booking.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>

          {/* Free */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Free</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', marginBottom: 28 }}>Forever free</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {freeFeatures.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,245,236,0.6)' }}>
                  <span style={{ color: 'rgba(255,245,236,0.3)', fontSize: 16 }}>·</span>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/deals" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,245,236,0.7)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '14px', borderRadius: 100, fontSize: 14, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
              Continue with free
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.35)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF5C3A', color: 'white', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: '0 24px 0 12px', letterSpacing: 0.5 }}>MOST POPULAR</div>

            <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.8)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>₹999</span>
              <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)', marginBottom: 28 }}>Cancel anytime · No hidden fees</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {proFeatures.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,245,236,0.8)' }}>
                  <span style={{ color: '#4CAF50', fontSize: 14, fontWeight: 700 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <button onClick={handlePayment} disabled={loading} style={{ width: '100%', padding: '16px', background: '#FF5C3A', color: 'white', border: 'none', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}>
              {loading ? 'Processing...' : user ? 'Upgrade to Pro →' : 'Sign in to upgrade →'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.3)', marginTop: 12 }}>
              Secured by Razorpay · UPI, Cards, NetBanking accepted
            </div>
          </div>
        </div>

        {/* ROI calculator */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>The math is simple</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[['₹999', 'Monthly cost'], ['₹18,000+', 'Avg. savings per trip'], ['18x', 'ROI on first booking']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1, color: '#FF5C3A', marginBottom: 6 }}>{val}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>Common questions</div>
          {[
            ['Can I cancel anytime?', 'Yes — cancel with one click from your account settings. No questions asked.'],
            ['How do I pay?', 'We accept all major UPI apps, credit/debit cards, and NetBanking through Razorpay.'],
            ['When do deals unlock?', 'Instantly after payment — you\'ll be redirected to the full deals page.'],
            ['What if there are no good deals?', 'We post new deals daily. If a month has fewer deals than usual, contact us for a refund.'],
          ].map(([q, a], i) => (
            <div key={i} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', padding: '20px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{q}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,245,236,0.5)', lineHeight: 1.6, fontWeight: 300 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
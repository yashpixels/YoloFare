'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function PricingPage() {
  const router  = useRouter()
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function handleUpgrade() {
    if (!user) { router.push('/login?redirect=/pricing'); return }
    setLoading(true)
    try {
      // 1. Create Razorpay order (₹1 for testing)
      const res   = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { orderId, amount, error: orderError } = await res.json()
      if (orderError) throw new Error(orderError)

      // 2. Open Razorpay checkout
      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount,
        currency:    'INR',
        name:        'YoloFare',
        description: 'YoloFare Pro — Monthly Subscription',
        order_id:    orderId,
        prefill: {
          email: user.email,
        },
        theme: { color: '#FF5C3A' },
        handler: async function (response) {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              userId:              user.id,
            }),
          })
          const { success, error: verifyError } = await verifyRes.json()
          if (verifyError) throw new Error(verifyError)
          if (success) {
            // 4. Redirect to preferences onboarding
            router.push('/preferences?new=true')
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert('Payment failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15, top: -150, right: -100 }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC', textDecoration: 'none' }}>
          Yolo<span style={{ color: '#FF5C3A' }}>Fare</span>
        </Link>
        {user
          ? <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)' }}>{user.email}</span>
          : <Link href="/login" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none' }}>Login</Link>
        }
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px,6vw,56px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
            One trip pays for<br/><em style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FF5C3A' }}>18 months</em> of Pro.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,245,236,0.45)', fontWeight: 300 }}>
            Avg. member saves ₹18,000+ per trip. At ₹999/mo that's an 18x ROI.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Free */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Free</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Forever free</div>
            {['3 deals visible', 'South East Asia only', 'Economy class'].map(f => (
              <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.45)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,245,236,0.2)', fontSize: 18 }}>·</span>{f}
              </div>
            ))}
            <Link href="/deals" style={{ display: 'block', textAlign: 'center', marginTop: 28, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,245,236,0.6)', padding: '13px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.1)' }}>
              Browse free deals
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.35)', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF5C3A', color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 16px', borderRadius: '0 24px 0 12px', letterSpacing: 0.5 }}>MOST POPULAR</div>
            <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.8)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800 }}>₹999</span>
              <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.4)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Cancel anytime · No hidden fees</div>
            {['All deals unlocked', 'All regions & all classes', 'WhatsApp deal alerts', 'Set your destination wishlist', 'Cancel anytime'].map(f => (
              <div key={f} style={{ fontSize: 14, color: 'rgba(255,245,236,0.8)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: '#4CAF50', fontWeight: 700 }}>✓</span>{f}
              </div>
            ))}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{ width: '100%', marginTop: 28, background: loading ? 'rgba(255,92,58,0.5)' : '#FF5C3A', color: 'white', border: 'none', padding: '15px', borderRadius: 100, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne', sans-serif', letterSpacing: -0.3" }}>
              {loading ? 'Opening checkout...' : user ? 'Upgrade to Pro →' : 'Sign in to upgrade →'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.25)', marginTop: 10 }}>
              Secured by Razorpay · UPI, Cards, NetBanking
            </div>
          </div>
        </div>

        {/* ROI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
          {[['₹999', 'Monthly cost'], ['₹18,000+', 'Avg. savings per trip'], ['18x', 'ROI on first booking']].map(([val, label], i) => (
            <div key={label} style={{ padding: '20px', textAlign: 'center', borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: '#FF5C3A' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,245,236,0.35)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

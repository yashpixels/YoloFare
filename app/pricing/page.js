'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { trackProPurchase } from '../../lib/pixel.js'

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PricingPage() {
  const router    = useRouter()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    loadRazorpay()
    return () => subscription.unsubscribe()
  }, [])

  async function handleUpgrade() {
    if (!user) { router.push('/login?redirect=/pricing'); return }
    setLoading(true)
    setStatus('Loading checkout...')

    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay failed to load.')

      setStatus('Creating order...')
      const res = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { orderId, amount, error: orderError } = await res.json()
      if (orderError) throw new Error(orderError)

      setStatus('Opening checkout...')

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount,
        currency:    'INR',
        name:        'YoloFare',
        description: 'YoloFare Pro — Monthly',
        order_id:    orderId,
        prefill:     { email: user.email },
        theme:       { color: '#FF5C3A' },

        handler: async function (response) {
          setStatus('Verifying payment...')
          try {
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
            const data = await verifyRes.json()
            if (data.success) {
              setStatus('Payment confirmed! Redirecting...')
              trackProPurchase()
              window.location.href = '/preferences?new=true'
            } else {
              throw new Error(data.error || 'Verification failed')
            }
          } catch (err) {
            setStatus('')
            setLoading(false)
            alert('Payment verification failed: ' + err.message)
          }
        },

        modal: {
          ondismiss: () => { setLoading(false); setStatus('') }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        setLoading(false)
        setStatus('')
        alert('Payment failed: ' + resp.error.description)
      })
      rzp.open()

    } catch (err) {
      setLoading(false)
      setStatus('')
      alert('Error: ' + err.message)
    }
  }

  const freeFeats = [
    { icon: '·', text: '3 deals visible (teaser only)' },
    { icon: '·', text: 'South East Asia only' },
    { icon: '·', text: 'Economy class only' },
    { icon: '·', text: 'No deal alerts' },
    { icon: '·', text: 'No preferences profile' },
  ]

  const proFeats = [
    { text: 'All deals unlocked — every region, every class' },
    { text: 'Instant alerts via email + WhatsApp', tag: 'NEW' },
    { text: 'Personalised to your wishlist & home city' },
    { text: 'Error fares & flash deals first (before they vanish)' },
    { text: 'Business & First Class deals included' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A08', color: '#FFF5EC', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #FF5C3A 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15, top: -150, right: -100 }} />
      </div>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFF5EC', textDecoration: 'none' }}>
          Yolo<span style={{ color: '#FF5C3A' }}>Fare</span>
        </Link>
        {user
          ? <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>

          {/* FREE */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,245,236,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Free</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Forever free · No card needed</div>

            {freeFeats.map(f => (
              <div key={f.text} style={{ fontSize: 14, color: 'rgba(255,245,236,0.38)', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(255,245,236,0.18)', fontSize: 18, lineHeight: 1.2, flexShrink: 0 }}>·</span>
                {f.text}
              </div>
            ))}

            <Link href="/deals" style={{ display: 'block', textAlign: 'center', marginTop: 28, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,245,236,0.6)', padding: '13px', borderRadius: 100, fontSize: 14, textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.1)' }}>
              Browse free deals
            </Link>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,92,58,0.5)', marginTop: 10 }}>
              Deals expire fast — free users often miss out
            </div>
          </div>

          {/* PRO */}
          <div style={{ background: 'rgba(255,92,58,0.08)', border: '1px solid rgba(255,92,58,0.35)', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF5C3A', color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 16px', borderRadius: '0 24px 0 12px', letterSpacing: 0.5 }}>MOST POPULAR</div>
            <div style={{ fontSize: 11, color: 'rgba(255,92,58,0.8)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800 }}>₹999</span>
              <span style={{ fontSize: 14, color: 'rgba(255,245,236,0.4)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,245,236,0.35)', marginBottom: 24 }}>Cancel anytime · No hidden fees</div>

            {proFeats.map(f => (
              <div key={f.text} style={{ fontSize: 14, color: 'rgba(255,245,236,0.85)', marginBottom: 11, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#FF5C3A', fontWeight: 700, flexShrink: 0, lineHeight: 1.4 }}>✓</span>
                <span>
                  {f.text}
                  {f.tag && (
                    <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, marginLeft: 6, background: 'rgba(255,92,58,0.18)', color: '#FF5C3A', letterSpacing: 0.5, verticalAlign: 'middle' }}>
                      {f.tag}
                    </span>
                  )}
                </span>
              </div>
            ))}

            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{ width: '100%', marginTop: 24, background: loading ? 'rgba(255,92,58,0.5)' : '#FF5C3A', color: 'white', border: 'none', padding: '15px', borderRadius: 100, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}>
              {loading ? `⏳ ${status || 'Loading...'}` : user ? 'Upgrade to Pro →' : 'Sign in to upgrade →'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.25)', marginTop: 10 }}>
              Secured by Razorpay · UPI, Cards, NetBanking
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
          {[['₹999','Monthly cost'],['₹18,000+','Avg. savings per trip'],['18x','ROI on first booking']].map(([val,label],i) => (
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


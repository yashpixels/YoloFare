'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { trackProPurchase, trackAddToCart, trackInitiateCheckout } from '../lib/pixel.js'

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

function getMetaCookies() {
  if (typeof document === 'undefined') return {}
  const get = (name) => {
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))
    return m ? decodeURIComponent(m[1]) : undefined
  }
  return { fbc: get('_fbc'), fbp: get('_fbp') }
}

export function NavUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  if (!user) return <Link href="/login" style={{ fontSize: 14, color: 'rgba(255,245,236,0.55)', textDecoration: 'none' }}>Login</Link>
  return <span style={{ fontSize: 13, color: 'rgba(255,245,236,0.5)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
}

export function UpgradeButton() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    // Preload Razorpay in background so it's ready when clicked
    loadRazorpay()
    return () => subscription.unsubscribe()
  }, [])

  async function handleUpgrade() {
    if (!user) { router.push('/login?redirect=/pricing'); return }
    setLoading(true)
    trackAddToCart()
    setStatus('Loading checkout...')

    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay failed to load.')

      setStatus('Creating order...')
      const { fbc, fbp } = getMetaCookies()
      const res = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, fbc, fbp }),
      })
      const { orderId, amount, eventId: checkoutEventId, error: orderError } = await res.json()
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
            const purchaseEventId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
              (c ^ (Math.random() * 16 >> c / 4)).toString(16)
            )
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                userId: user.id,
                fbc, fbp,
                purchaseEventId,
              }),
            })
            const data = await verifyRes.json()
            if (data.success) {
              setStatus('Payment confirmed! Redirecting...')
              trackProPurchase(purchaseEventId)
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

        modal: { ondismiss: () => { setLoading(false); setStatus('') } },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        setLoading(false); setStatus('')
        alert('Payment failed: ' + resp.error.description)
      })
      trackInitiateCheckout(checkoutEventId)
      rzp.open()

    } catch (err) {
      setLoading(false); setStatus('')
      alert('Error: ' + err.message)
    }
  }

  return (
    <>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        style={{ width: '100%', marginTop: 24, background: loading ? 'rgba(255,92,58,0.5)' : '#FF5C3A', color: 'white', border: 'none', padding: '15px', borderRadius: 100, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}>
        {loading ? `⏳ ${status || 'Loading...'}` : user ? 'Upgrade to Pro →' : 'Sign in to upgrade →'}
      </button>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,245,236,0.25)', marginTop: 10 }}>
        Secured by Razorpay · UPI, Cards, NetBanking
      </div>
    </>
  )
}

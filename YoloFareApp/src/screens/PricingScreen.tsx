import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/colors'
import RazorpayCheckout from 'react-native-razorpay'

const RAZORPAY_KEY = 'rzp_live_SvupG5ja4m5IZp'
const API_BASE = 'https://www.yolofare.com'

export default function PricingScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkPro(session.user.id)
    })
  }, [])

  async function checkPro(userId: string) {
    const { data } = await supabase.from('subscriptions').select('status').eq('user_id', userId).eq('status', 'active').single()
    setIsPro(!!data)
  }

  async function handleUpgrade() {
    if (!user) { navigation.navigate('Login'); return }
    if (isPro) { Alert.alert('You are already Pro!'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { orderId, amount, error: orderError } = await res.json()
      if (orderError) throw new Error(orderError)

      const options = {
        description: 'YoloFare Pro — Monthly',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: String(amount),
        order_id: orderId,
        prefill: { email: user.email, contact: '' },
        theme: { color: '#FF5C3A' },
      }

      const data = await RazorpayCheckout.open(options)

      const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
          userId: user.id,
        }),
      })
      const result = await verifyRes.json()
      if (result.success) {
        setIsPro(true)
        Alert.alert('🎉 Welcome to Pro!', 'All deals are now unlocked.', [
          { text: 'View Deals', onPress: () => navigation.navigate('Deals') },
        ])
      }
    } catch (e: any) {
      if (e.code !== 'PAYMENT_CANCELLED') Alert.alert('Error', e.description || e.message)
    } finally {
      setLoading(false)
    }
  }

  const proFeats = [
    'All deals unlocked — every region, every class',
    'Instant alerts via email + WhatsApp',
    'Personalised to your wishlist & home city',
    'Error fares & flash deals first',
    'Business & First Class deals included',
  ]

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <Text style={s.heading}>One trip pays for{'\n'}<Text style={{ color: colors.accent, fontStyle: 'italic' }}>18 months</Text> of Pro.</Text>
      <Text style={s.sub}>Avg. member saves ₹18,000+ per trip. That's an 18x ROI.</Text>

      <View style={s.grid}>
        {/* Free */}
        <View style={s.freeCard}>
          <Text style={s.planLabel}>FREE</Text>
          <Text style={s.freePrice}>₹0</Text>
          <Text style={s.priceNote}>Forever free</Text>
          {['3 deals visible', 'South East Asia only', 'Economy only', 'No alerts', 'No wishlist'].map(f => (
            <Text key={f} style={s.freeFeat}>· {f}</Text>
          ))}
          <TouchableOpacity style={s.freeBtn} onPress={() => navigation.navigate('Deals')}>
            <Text style={s.freeBtnText}>Browse free deals</Text>
          </TouchableOpacity>
          <Text style={s.urgency}>Deals expire fast — free users miss out</Text>
        </View>

        {/* Pro */}
        <View style={s.proCard}>
          <View style={s.popularBadge}><Text style={s.popularText}>MOST POPULAR</Text></View>
          <Text style={s.planLabelPro}>PRO</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={s.proPrice}>₹999</Text>
            <Text style={s.priceNote}>/month</Text>
          </View>
          <Text style={s.priceNote}>Cancel anytime · No hidden fees</Text>
          <View style={{ height: 12 }} />
          {proFeats.map(f => (
            <View key={f} style={s.proFeatRow}>
              <Text style={s.checkmark}>✓</Text>
              <Text style={s.proFeat}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity style={[s.proBtn, isPro && s.proBtnDisabled]} onPress={handleUpgrade} disabled={loading || isPro}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={s.proBtnText}>{isPro ? '✓ Already Pro' : user ? 'Upgrade to Pro →' : 'Sign in to upgrade →'}</Text>
            )}
          </TouchableOpacity>
          <Text style={s.security}>Secured by Razorpay · UPI, Cards, NetBanking</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[['₹999', 'Monthly cost'], ['₹18,000+', 'Avg. savings'], ['18x', 'ROI']].map(([val, label]) => (
          <View key={label} style={s.statItem}>
            <Text style={s.statVal}>{val}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 10, lineHeight: 36 },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 28 },
  grid: { gap: 14, marginBottom: 20 },
  freeCard: { backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 0.5, borderColor: colors.border },
  proCard: { backgroundColor: 'rgba(255,92,58,0.08)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.borderPro, position: 'relative', overflow: 'hidden' },
  popularBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 6, borderBottomLeftRadius: 12 },
  popularText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  planLabel: { fontSize: 11, color: colors.textMuted, letterSpacing: 2, marginBottom: 10 },
  planLabelPro: { fontSize: 11, color: colors.accent, letterSpacing: 2, marginBottom: 10 },
  freePrice: { fontSize: 36, fontWeight: '800', color: colors.text, marginBottom: 4 },
  proPrice: { fontSize: 36, fontWeight: '800', color: colors.text },
  priceNote: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  freeFeat: { fontSize: 13, color: 'rgba(255,245,236,0.38)', marginBottom: 8 },
  freeBtn: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 50, paddingVertical: 12, alignItems: 'center', marginTop: 16, borderWidth: 0.5, borderColor: colors.border },
  freeBtnText: { color: colors.textMuted, fontSize: 14 },
  urgency: { textAlign: 'center', fontSize: 11, color: 'rgba(255,92,58,0.6)', marginTop: 8 },
  proFeatRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  checkmark: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  proFeat: { flex: 1, fontSize: 13, color: 'rgba(255,245,236,0.85)', lineHeight: 20 },
  proBtn: { backgroundColor: colors.accent, borderRadius: 50, paddingVertical: 15, alignItems: 'center', marginTop: 16 },
  proBtnDisabled: { backgroundColor: 'rgba(255,92,58,0.4)' },
  proBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  security: { textAlign: 'center', fontSize: 11, color: colors.textDim, marginTop: 8 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.border },
  statItem: { flex: 1, padding: 16, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '700', color: colors.accent },
  statLabel: { fontSize: 11, color: colors.textDim, marginTop: 4 },
})

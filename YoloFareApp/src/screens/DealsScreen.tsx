import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, RefreshControl, ActivityIndicator,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/colors'

const REGIONS = ['All', 'South East Asia', 'Europe', 'USA', 'Canada', 'Middle East']
const CLASSES = ['All Classes', 'Economy', 'Business', 'First']

export default function DealsScreen({ navigation }: any) {
  const [deals, setDeals] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [region, setRegion] = useState('All')
  const [cabinClass, setCabinClass] = useState('All Classes')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkPro(session.user.id)
    })
    fetchDeals()
  }, [])

  async function checkPro(userId: string) {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    setIsPro(!!data)
  }

  async function fetchDeals() {
    setLoading(true)
    let query = supabase.from('deals').select('*').eq('is_active', true).order('created_at', { ascending: false })
    if (!isPro) query = query.eq('is_free_preview', true)
    const { data } = await query
    setDeals(data || [])
    setLoading(false)
  }

  async function onRefresh() {
    setRefreshing(true)
    await fetchDeals()
    setRefreshing(false)
  }

  const filtered = deals.filter(d => {
    if (region !== 'All' && d.region !== region) return false
    if (cabinClass !== 'All Classes' && d.cabin_class !== cabinClass.toLowerCase()) return false
    return true
  })

  return (
    <View style={s.root}>
      {isPro && (
        <View style={s.proBanner}>
          <Text style={s.proBannerText}>⭐ Pro Member — All deals unlocked</Text>
        </View>
      )}

      {/* Region filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {REGIONS.map(r => (
          <TouchableOpacity key={r} style={[s.chip, region === r && s.chipActive]} onPress={() => setRegion(r)}>
            <Text style={[s.chipText, region === r && s.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Class filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CLASSES.map(c => (
          <TouchableOpacity key={c} style={[s.chip, cabinClass === c && s.chipActive]} onPress={() => setCabinClass(c)}>
            <Text style={[s.chipText, cabinClass === c && s.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          {!user && (
            <View style={s.nudge}>
              <Text style={s.nudgeText}>Sign in to see all free deals</Text>
              <TouchableOpacity style={s.nudgeBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={s.nudgeBtnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {filtered.map(deal => (
            <TouchableOpacity key={deal.id} style={s.card} onPress={() => navigation.navigate('DealDetail', { deal })}>
              {deal.image_url && (
                <Image source={{ uri: deal.image_url }} style={s.cardImage} />
              )}
              <View style={s.cardBadges}>
                <Text style={s.airlineBadge}>{deal.airline}</Text>
                <Text style={s.offBadge}>{deal.savings_pct}% off</Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.destination}>{deal.destination}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={s.route}>{deal.origin_code} → {deal.dest_code}</Text>
                  <View style={s.classBadge}><Text style={s.classBadgeText}>{deal.cabin_class}</Text></View>
                </View>
                <Text style={s.dates}>{deal.travel_dates}</Text>
                <View style={s.priceRow}>
                  <Text style={s.price}>₹{deal.deal_price?.toLocaleString('en-IN')}</Text>
                  <Text style={s.regularPrice}>₹{deal.regular_price?.toLocaleString('en-IN')}</Text>
                </View>
                <Text style={s.stops}>{deal.stops === 0 ? '● Non-stop' : `● ${deal.stops} stop`}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {!isPro && user && (
            <TouchableOpacity style={s.upgradeCard} onPress={() => navigation.navigate('Pricing')}>
              <Text style={s.upgradeTitle}>🔒 More deals locked</Text>
              <Text style={s.upgradeText}>Upgrade to Pro to unlock all deals</Text>
              <View style={s.upgradeBtn}><Text style={s.upgradeBtnText}>Upgrade · ₹999/mo →</Text></View>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  proBanner: { backgroundColor: 'rgba(255,92,58,0.15)', padding: 10, alignItems: 'center' },
  proBannerText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  filterRow: { maxHeight: 48, paddingVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 0.5, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, gap: 16, paddingBottom: 40 },
  nudge: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0.5, borderColor: colors.border },
  nudgeText: { color: colors.textMuted, fontSize: 13 },
  nudgeBtn: { backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  nudgeBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.border },
  cardImage: { width: '100%', height: 160 },
  cardBadges: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  airlineBadge: { backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  offBadge: { backgroundColor: colors.accent, color: '#fff', fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  cardBody: { padding: 16 },
  destination: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 6 },
  route: { fontSize: 13, color: colors.textMuted },
  classBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 2 },
  classBadgeText: { fontSize: 11, color: colors.textMuted },
  dates: { fontSize: 12, color: colors.textDim, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 6 },
  price: { fontSize: 26, fontWeight: '700', color: colors.text },
  regularPrice: { fontSize: 14, color: colors.textDim, textDecorationLine: 'line-through' },
  stops: { fontSize: 12, color: colors.green },
  upgradeCard: { backgroundColor: 'rgba(255,92,58,0.08)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.borderPro, alignItems: 'center', gap: 8 },
  upgradeTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  upgradeText: { fontSize: 14, color: colors.textMuted },
  upgradeBtn: { backgroundColor: colors.accent, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12, marginTop: 4 },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})

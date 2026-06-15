import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/colors'

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [subExpiry, setSubExpiry] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchSub(session.user.id)
    })
  }, [])

  async function fetchSub(userId: string) {
    const { data } = await supabase.from('subscriptions').select('status, expires_at').eq('user_id', userId).eq('status', 'active').single()
    if (data) {
      setIsPro(true)
      setSubExpiry(data.expires_at ? new Date(data.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null)
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); setUser(null); setIsPro(false) } },
    ])
  }

  if (!user) {
    return (
      <View style={s.centered}>
        <Text style={s.notLoggedTitle}>Not signed in</Text>
        <Text style={s.notLoggedSub}>Sign in to manage your account and preferences</Text>
        <TouchableOpacity style={s.signInBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={s.signInBtnText}>Sign In →</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <View style={s.avatarRow}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user.email?.[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={s.email}>{user.email}</Text>
          <View style={[s.planBadge, isPro && s.planBadgePro]}>
            <Text style={[s.planBadgeText, isPro && s.planBadgeTextPro]}>{isPro ? '⭐ Pro Member' : 'Free Plan'}</Text>
          </View>
        </View>
      </View>

      {isPro && subExpiry && (
        <View style={s.subCard}>
          <Text style={s.subCardLabel}>Pro subscription active</Text>
          <Text style={s.subCardExpiry}>Renews {subExpiry}</Text>
        </View>
      )}

      {!isPro && (
        <TouchableOpacity style={s.upgradeCard} onPress={() => navigation.navigate('Pricing')}>
          <Text style={s.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={s.upgradeText}>Unlock all deals for ₹999/month →</Text>
        </TouchableOpacity>
      )}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        <TouchableOpacity style={s.row} onPress={handleSignOut}>
          <Text style={s.rowText}>Sign Out</Text>
          <Text style={s.rowChevron}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  notLoggedTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  notLoggedSub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  signInBtn: { backgroundColor: colors.accent, borderRadius: 50, paddingHorizontal: 32, paddingVertical: 14 },
  signInBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  email: { fontSize: 15, color: colors.text, fontWeight: '600', marginBottom: 6 },
  planBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3 },
  planBadgePro: { backgroundColor: 'rgba(255,92,58,0.2)' },
  planBadgeText: { fontSize: 12, color: colors.textMuted },
  planBadgeTextPro: { color: colors.accent, fontWeight: '600' },
  subCard: { backgroundColor: 'rgba(255,92,58,0.08)', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 0.5, borderColor: colors.borderPro },
  subCardLabel: { fontSize: 13, color: colors.accent, fontWeight: '600', marginBottom: 4 },
  subCardExpiry: { fontSize: 12, color: colors.textMuted },
  upgradeCard: { backgroundColor: colors.accent, borderRadius: 16, padding: 16, marginBottom: 16 },
  upgradeTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  upgradeText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  section: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.border, marginBottom: 16 },
  sectionTitle: { fontSize: 11, color: colors.textDim, letterSpacing: 1, padding: 12, paddingBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 0.5, borderTopColor: colors.border },
  rowText: { fontSize: 14, color: '#FF6B6B' },
  rowChevron: { color: colors.textDim },
})

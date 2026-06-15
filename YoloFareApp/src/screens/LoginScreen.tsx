import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/colors'

export default function LoginScreen() {
  const [tab, setTab] = useState<'magic' | 'password'>('magic')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  async function handleMagicLink() {
    if (!email) { Alert.alert('Enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'yolofare://deals' },
    })
    setLoading(false)
    if (error) Alert.alert('Error', error.message)
    else setMagicSent(true)
  }

  async function handlePassword() {
    if (!email || !password) { Alert.alert('Fill in all fields'); return }
    setLoading(true)
    const fn = mode === 'signin'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password })
    const { error } = await fn
    setLoading(false)
    if (error) Alert.alert('Error', error.message)
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>Yolo<Text style={{ color: colors.accent }}>Fare</Text></Text>
        <Text style={s.tagline}>Cheap international flights{'\n'}from India</Text>

        {/* Tabs */}
        <View style={s.tabs}>
          {(['magic', 'password'] as const).map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'magic' ? '✉️ Magic Link' : '🔑 Password'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.card}>
          {tab === 'magic' ? (
            magicSent ? (
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 32, marginBottom: 12 }}>📬</Text>
                <Text style={[s.label, { textAlign: 'center', fontSize: 15 }]}>Check your email for the magic link!</Text>
              </View>
            ) : (
              <>
                <Text style={s.label}>Email</Text>
                <TextInput style={s.input} value={email} onChangeText={setEmail}
                  placeholder="you@example.com" placeholderTextColor={colors.textDim}
                  keyboardType="email-address" autoCapitalize="none" />
                <TouchableOpacity style={s.btn} onPress={handleMagicLink} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Send Magic Link →</Text>}
                </TouchableOpacity>
              </>
            )
          ) : (
            <>
              <View style={s.subTabs}>
                {(['signin', 'signup'] as const).map(m => (
                  <TouchableOpacity key={m} onPress={() => setMode(m)} style={[s.subTab, mode === m && s.subTabActive]}>
                    <Text style={[s.subTabText, mode === m && s.subTabTextActive]}>
                      {m === 'signin' ? 'Sign In' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={s.label}>Email</Text>
              <TextInput style={s.input} value={email} onChangeText={setEmail}
                placeholder="you@example.com" placeholderTextColor={colors.textDim}
                keyboardType="email-address" autoCapitalize="none" />
              <Text style={s.label}>Password</Text>
              <TextInput style={s.input} value={password} onChangeText={setPassword}
                placeholder="••••••••" placeholderTextColor={colors.textDim} secureTextEntry />
              <TouchableOpacity style={s.btn} onPress={handlePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <Text style={s.btnText}>{mode === 'signin' ? 'Sign In →' : 'Create Account →'}</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 80 },
  logo: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  tagline: { fontSize: 15, color: colors.textMuted, marginBottom: 40, lineHeight: 22 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontSize: 13, color: colors.textMuted },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.border, borderRadius: 20, padding: 20 },
  subTabs: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  subTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  subTabActive: { borderColor: colors.accent },
  subTabText: { fontSize: 13, color: colors.textMuted },
  subTabTextActive: { color: colors.accent, fontWeight: '600' },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 0.5, borderColor: colors.border, borderRadius: 10, padding: 14, color: colors.text, fontSize: 15 },
  btn: { marginTop: 20, backgroundColor: colors.accent, borderRadius: 50, paddingVertical: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
})

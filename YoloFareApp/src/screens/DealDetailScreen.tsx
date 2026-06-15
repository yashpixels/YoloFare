import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { colors } from '../lib/colors'

export default function DealDetailScreen({ route }: any) {
  const { deal } = route.params

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      {deal.image_url && <Image source={{ uri: deal.image_url }} style={s.image} />}

      <View style={s.body}>
        <View style={s.badgeRow}>
          <Text style={s.airlineBadge}>{deal.airline}</Text>
          <Text style={s.offBadge}>{deal.savings_pct}% off</Text>
          <View style={s.classBadge}><Text style={s.classBadgeText}>{deal.cabin_class}</Text></View>
        </View>

        <Text style={s.destination}>{deal.destination}</Text>
        <Text style={s.route}>{deal.origin_city} → {deal.destination} · {deal.travel_dates}</Text>

        <View style={s.priceCard}>
          <View>
            <Text style={s.priceLabel}>Deal price</Text>
            <Text style={s.price}>₹{deal.deal_price?.toLocaleString('en-IN')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.priceLabel}>Regular price</Text>
            <Text style={s.regularPrice}>₹{deal.regular_price?.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={s.infoRow}>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Stops</Text>
            <Text style={s.infoValue}>{deal.stops === 0 ? 'Non-stop' : `${deal.stops} stop`}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Class</Text>
            <Text style={s.infoValue}>{deal.cabin_class}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Route</Text>
            <Text style={s.infoValue}>{deal.origin_code} → {deal.dest_code}</Text>
          </View>
        </View>

        {deal.description && (
          <View style={s.descCard}>
            <Text style={s.descText}>{deal.description}</Text>
          </View>
        )}

        <TouchableOpacity style={s.bookBtn} onPress={() => deal.booking_url && Linking.openURL(deal.booking_url)}>
          <Text style={s.bookBtnText}>Book on Google Flights →</Text>
        </TouchableOpacity>

        {deal.expires_at && (
          <Text style={s.expires}>Deal expires {new Date(deal.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        )}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  image: { width: '100%', height: 220 },
  body: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  airlineBadge: { backgroundColor: 'rgba(255,255,255,0.08)', color: colors.text, fontSize: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  offBadge: { backgroundColor: colors.accent, color: '#fff', fontSize: 12, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  classBadge: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  classBadgeText: { fontSize: 12, color: colors.textMuted },
  destination: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  route: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  priceCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, borderColor: colors.border, marginBottom: 16 },
  priceLabel: { fontSize: 11, color: colors.textDim, marginBottom: 4 },
  price: { fontSize: 28, fontWeight: '700', color: colors.text },
  regularPrice: { fontSize: 18, color: colors.textDim, textDecorationLine: 'line-through' },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoItem: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: colors.border },
  infoLabel: { fontSize: 10, color: colors.textDim, marginBottom: 4 },
  infoValue: { fontSize: 13, color: colors.text, fontWeight: '600' },
  descCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 0.5, borderColor: colors.border },
  descText: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
  bookBtn: { backgroundColor: colors.accent, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  expires: { textAlign: 'center', fontSize: 12, color: colors.textDim },
})

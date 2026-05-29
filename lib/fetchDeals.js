import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CITIES = [
  { code: 'DEL', name: 'Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bangalore' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'MAA', name: 'Chennai' },
]

const AIRPORT_COUNTRY = {
  // South East Asia
  'SIN': 'SG', 'BKK': 'TH', 'DMK': 'TH', 'HKT': 'TH', 'CNX': 'TH', 'USM': 'TH',
  'CGK': 'ID', 'DPS': 'ID', 'SUB': 'ID', 'JOG': 'ID', 'LOP': 'ID',
  'KUL': 'MY', 'PEN': 'MY', 'LGK': 'MY', 'BKI': 'MY',
  'HAN': 'VN', 'SGN': 'VN', 'DAD': 'VN', 'CXR': 'VN',
  'MNL': 'PH', 'CEB': 'PH', 'KLO': 'PH',
  'RGN': 'MM', 'MDL': 'MM',
  'PNH': 'KH', 'REP': 'KH',
  'VTE': 'LA', 'LPQ': 'LA',
  // East Asia
  'NRT': 'JP', 'HND': 'JP', 'KIX': 'JP', 'NGO': 'JP', 'CTS': 'JP', 'FUK': 'JP',
  'ICN': 'KR', 'GMP': 'KR', 'PUS': 'KR', 'CJU': 'KR',
  'HKG': 'HK', 'MFM': 'MO',
  'TPE': 'TW', 'KHH': 'TW',
  'PEK': 'CN', 'PVG': 'CN', 'CAN': 'CN', 'CTU': 'CN',
  // Europe
  'LHR': 'GB', 'LGW': 'GB', 'MAN': 'GB', 'EDI': 'GB', 'BHX': 'GB', 'GLA': 'GB',
  'CDG': 'FR', 'ORY': 'FR', 'NCE': 'FR', 'LYS': 'FR', 'MRS': 'FR',
  'FRA': 'DE', 'MUC': 'DE', 'BER': 'DE', 'DUS': 'DE', 'HAM': 'DE', 'STR': 'DE',
  'FCO': 'IT', 'MXP': 'IT', 'VCE': 'IT', 'NAP': 'IT', 'FCO': 'IT', 'BGY': 'IT',
  'MAD': 'ES', 'BCN': 'ES', 'AGP': 'ES', 'ALC': 'ES', 'PMI': 'ES', 'VLC': 'ES',
  'LIS': 'PT', 'OPO': 'PT', 'FAO': 'PT',
  'AMS': 'NL', 'EIN': 'NL', 'RTM': 'NL',
  'ATH': 'GR', 'SKG': 'GR', 'HER': 'GR', 'RHO': 'GR', 'CFU': 'GR',
  'ZRH': 'CH', 'GVA': 'CH', 'BSL': 'CH',
  'VIE': 'AT', 'SZG': 'AT', 'GRZ': 'AT',
  'ARN': 'SE', 'GOT': 'SE', 'MMX': 'SE',
  'CPH': 'DK', 'AAL': 'DK',
  'OSL': 'NO', 'BGO': 'NO', 'TRD': 'NO',
  'HEL': 'FI', 'TMP': 'FI',
  'IST': 'TR', 'SAW': 'TR', 'AYT': 'TR', 'ADB': 'TR', 'ESB': 'TR',
  'WAW': 'PL', 'KRK': 'PL', 'GDN': 'PL',
  'PRG': 'CZ', 'BRQ': 'CZ',
  'DUB': 'IE', 'ORK': 'IE',
  'BRU': 'BE', 'CRL': 'BE',
  'BUD': 'HU', 'DEB': 'HU',
  'BUH': 'RO', 'CLJ': 'RO',
  'SOF': 'BG', 'VAR': 'BG',
  'OTP': 'RO',
  'LJU': 'SI', 'MBX': 'SI',
  'ZAG': 'HR', 'DBV': 'HR', 'SPU': 'HR',
  'SKP': 'MK', 'TIA': 'AL',
  'BEG': 'RS', 'INI': 'RS',
  'KEF': 'IS',
  'RIX': 'LV', 'TLL': 'EE', 'VNO': 'LT',
  // North America
  'JFK': 'US', 'LAX': 'US', 'SFO': 'US', 'ORD': 'US', 'MIA': 'US',
  'SEA': 'US', 'BOS': 'US', 'IAD': 'US', 'EWR': 'US', 'DFW': 'US',
  'ATL': 'US', 'LAS': 'US', 'PHX': 'US', 'DEN': 'US', 'SAN': 'US',
  'MSP': 'US', 'DTW': 'US', 'PHL': 'US', 'CLT': 'US', 'HNL': 'US',
  'YYZ': 'CA', 'YVR': 'CA', 'YUL': 'CA', 'YYC': 'CA', 'YOW': 'CA', 'YEG': 'CA',
  // Middle East
  'DXB': 'AE', 'AUH': 'AE', 'SHJ': 'AE',
  'DOH': 'QA', 'RUH': 'SA', 'JED': 'SA', 'DMM': 'SA',
  'MCT': 'OM', 'SLL': 'OM',
  'KWI': 'KW', 'BAH': 'BH', 'AMM': 'JO',
  'TLV': 'IL', 'BEY': 'LB',
  // Oceania
  'SYD': 'AU', 'MEL': 'AU', 'BNE': 'AU', 'PER': 'AU', 'ADL': 'AU', 'CBR': 'AU',
  'AKL': 'NZ', 'CHC': 'NZ', 'WLG': 'NZ',
}

const REGION_MAP = {
  'SG': 'South East Asia', 'TH': 'South East Asia', 'ID': 'South East Asia',
  'MY': 'South East Asia', 'VN': 'South East Asia', 'PH': 'South East Asia',
  'MM': 'South East Asia', 'KH': 'South East Asia', 'LA': 'South East Asia',
  'JP': 'South East Asia', 'KR': 'South East Asia', 'HK': 'South East Asia',
  'TW': 'South East Asia', 'MO': 'South East Asia', 'CN': 'South East Asia',
  'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe',
  'ES': 'Europe', 'PT': 'Europe', 'NL': 'Europe', 'GR': 'Europe',
  'CH': 'Europe', 'AT': 'Europe', 'SE': 'Europe', 'DK': 'Europe',
  'NO': 'Europe', 'FI': 'Europe', 'TR': 'Europe', 'PL': 'Europe',
  'CZ': 'Europe', 'IE': 'Europe', 'BE': 'Europe', 'HU': 'Europe',
  'RO': 'Europe', 'BG': 'Europe', 'HR': 'Europe', 'SI': 'Europe',
  'RS': 'Europe', 'IS': 'Europe', 'LV': 'Europe', 'EE': 'Europe', 'LT': 'Europe',
  'US': 'USA', 'CA': 'Canada',
  'AE': 'Middle East', 'QA': 'Middle East', 'SA': 'Middle East',
  'OM': 'Middle East', 'KW': 'Middle East', 'BH': 'Middle East',
  'JO': 'Middle East', 'IL': 'Middle East', 'LB': 'Middle East',
  'AU': 'Oceania', 'NZ': 'Oceania',
}

const IMAGE_MAP = {
  'SG': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80',
  'JP': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
  'TH': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80',
  'ID': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  'GB': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
  'FR': 'https://images.unsplash.com/photo-1431274172761-fcdab704a0ef?w=600&q=80',
  'DE': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80',
  'IT': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  'ES': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
  'GR': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
  'US': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
  'CA': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80',
  'AE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
  'AU': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80',
  'NZ': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80',
  'HK': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80',
  'MY': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80',
  'VN': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
  'PT': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
  'NL': 'https://images.unsplash.com/photo-1584003564911-5f14fa85ab82?w=600&q=80',
  'TR': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80',
  'QA': 'https://images.unsplash.com/photo-1562575214-da9fcf59b907?w=600&q=80',
  'KR': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=600&q=80',
  'PH': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80',
  'CH': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'AT': 'https://images.unsplash.com/photo-1516550893885-985c836c5993?w=600&q=80',
  'CN': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80',
  'TW': 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&q=80',
}

// Expanded route pairs — all 5 Indian cities to major world destinations
const ROUTE_PAIRS = [
  // DEL — South East Asia
  ['DEL','SIN'],['DEL','BKK'],['DEL','KUL'],['DEL','HAN'],['DEL','SGN'],
  ['DEL','DPS'],['DEL','MNL'],['DEL','NRT'],['DEL','KIX'],['DEL','ICN'],
  ['DEL','HKG'],['DEL','TPE'],['DEL','CGK'],
  // DEL — Europe
  ['DEL','LHR'],['DEL','CDG'],['DEL','FRA'],['DEL','AMS'],['DEL','FCO'],
  ['DEL','MAD'],['DEL','BCN'],['DEL','ATH'],['DEL','IST'],['DEL','VIE'],
  ['DEL','ZRH'],['DEL','LIS'],['DEL','MUC'],['DEL','BER'],
  // DEL — USA/Canada
  ['DEL','JFK'],['DEL','LAX'],['DEL','SFO'],['DEL','ORD'],['DEL','YYZ'],['DEL','YVR'],
  // DEL — Middle East
  ['DEL','DXB'],['DEL','DOH'],['DEL','RUH'],['DEL','MCT'],
  // DEL — Oceania
  ['DEL','SYD'],['DEL','MEL'],
  // BOM — South East Asia
  ['BOM','SIN'],['BOM','BKK'],['BOM','KUL'],['BOM','DPS'],['BOM','HKG'],
  ['BOM','NRT'],['BOM','ICN'],['BOM','SGN'],['BOM','MNL'],
  // BOM — Europe
  ['BOM','LHR'],['BOM','CDG'],['BOM','FRA'],['BOM','FCO'],['BOM','MAD'],
  ['BOM','ATH'],['BOM','IST'],['BOM','AMS'],
  // BOM — USA/Canada
  ['BOM','JFK'],['BOM','LAX'],['BOM','YYZ'],
  // BOM — Middle East
  ['BOM','DXB'],['BOM','DOH'],['BOM','MCT'],
  // BOM — Oceania
  ['BOM','SYD'],['BOM','MEL'],
  // BLR — South East Asia
  ['BLR','SIN'],['BLR','BKK'],['BLR','KUL'],['BLR','DPS'],['BLR','HKG'],
  ['BLR','NRT'],['BLR','ICN'],
  // BLR — Europe
  ['BLR','LHR'],['BLR','CDG'],['BLR','FRA'],['BLR','FCO'],['BLR','IST'],
  // BLR — Middle East
  ['BLR','DXB'],['BLR','DOH'],
  // BLR — Oceania
  ['BLR','SYD'],
  // HYD — South East Asia
  ['HYD','SIN'],['HYD','BKK'],['HYD','KUL'],['HYD','DPS'],['HYD','HKG'],
  // HYD — Europe
  ['HYD','LHR'],['HYD','FRA'],['HYD','IST'],
  // HYD — Middle East
  ['HYD','DXB'],['HYD','DOH'],
  // MAA — South East Asia
  ['MAA','SIN'],['MAA','BKK'],['MAA','KUL'],['MAA','DPS'],['MAA','HKG'],
  // MAA — Europe
  ['MAA','LHR'],['MAA','CDG'],['MAA','IST'],
  // MAA — Middle East
  ['MAA','DXB'],['MAA','DOH'],
  // MAA — Oceania
  ['MAA','SYD'],
]

// Scan next 3 months (budget-conscious)
function getDateWindows() {
  const windows = []
  const today = new Date()
  for (let i = 1; i <= 3; i++) {
    const outbound = new Date(today)
    outbound.setMonth(outbound.getMonth() + i)
    outbound.setDate(1)
    const returnDate = new Date(outbound)
    returnDate.setDate(returnDate.getDate() + 7)
    const fmt = (d) => d.toISOString().split('T')[0]
    windows.push({
      outbound: fmt(outbound),
      returnDate: fmt(returnDate),
      label: outbound.toLocaleString('en', { month: 'long', year: 'numeric' })
    })
  }
  return windows
}

function getCabinClass(price) {
  if (price > 200000) return 'First'
  if (price > 80000) return 'Business'
  return 'Economy'
}

function getExpiryHours(cabinClass) {
  if (cabinClass === 'First') return 96
  if (cabinClass === 'Business') return 72
  return 48
}

export async function fetchAndStoreDeal() {
  console.log('Starting expanded SerpApi deal scan...')
  let totalNew = 0
  let totalExpired = 0
  let totalScanned = 0
  const errors = []
  const dateWindows = getDateWindows()
  const bestDeals = {}

  for (const [origin, dest] of ROUTE_PAIRS) {
    for (const window of dateWindows) {
      try {
        totalScanned++
        const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${origin}&arrival_id=${dest}&outbound_date=${window.outbound}&return_date=${window.returnDate}&currency=INR&hl=en&gl=in&api_key=${process.env.SERPAPI_KEY}`

        const res = await fetch(url)
        const data = await res.json()

        if (data.error) {
          errors.push({ route: `${origin}-${dest}`, error: data.error })
          continue
        }

        const priceInsights = data.price_insights || {}
        const typicalMax = priceInsights.typical_price_range?.[1] || null
        const priceLevel = priceInsights.price_level || 'typical'

        // Skip only if price is high AND savings < 20%
        const allFlights = [...(data.best_flights || []), ...(data.other_flights || [])]
        if (allFlights.length === 0) continue

        const cheapest = allFlights.sort((a, b) => a.price - b.price)[0]
        const price = cheapest.price
        const baseline = typicalMax || (price * 1.4)
        const savingsPct = Math.round(((baseline - price) / baseline) * 100)

        // Minimum 20% savings
        if (savingsPct < 20) continue
        // Skip if price level is high and savings < 30%
        if (priceLevel === 'high' && savingsPct < 30) continue

        const legs = cheapest.flights || []
        if (legs.length === 0) continue

        const stops = cheapest.layovers?.length || (legs.length - 1)
        if (stops > 1) continue

        const routeKey = `${origin}-${dest}`

        if (!bestDeals[routeKey] || price < bestDeals[routeKey].price) {
          const lastLeg = legs[legs.length - 1]
          const firstLeg = legs[0]
          const destCode = lastLeg?.arrival_airport?.id || dest
          const destName = lastLeg?.arrival_airport?.name || dest
          const countryCode = AIRPORT_COUNTRY[destCode] || AIRPORT_COUNTRY[dest] || ''
          const region = REGION_MAP[countryCode] || 'Other'
          if (region === 'Other') continue

          const cityObj = CITIES.find(c => c.code === origin)
          const cabinClass = getCabinClass(price)
          const expiryHours = getExpiryHours(cabinClass)
          const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString()
          const cleanDest = destName.replace(' International Airport', '').replace(' Airport', '').trim()

          bestDeals[routeKey] = {
            price,
            data: {
              destination: cleanDest,
              country: countryCode,
              region,
              origin_city: cityObj?.name || origin,
              origin_code: origin,
              dest_code: destCode,
              airline: firstLeg?.airline || 'Various',
              cabin_class: cabinClass,
              deal_price: price,
              regular_price: Math.round(baseline),
              savings_pct: savingsPct,
              stops,
              travel_dates: window.label,
              booking_url: `https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTAxagcIARID${origin}cgcIARID${destCode}`,
              image_url: IMAGE_MAP[countryCode] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
              description: `${stops === 0 ? 'Non-stop' : '1-stop'} ${cabinClass} deal to ${cleanDest} from ${cityObj?.name || origin} — ${savingsPct}% off typical fares. Travel in ${window.label}.`,
              is_active: true,
              expires_at: expiresAt,
            }
          }
        }
      } catch (err) {
        errors.push({ route: `${origin}-${dest}`, error: err.message })
      }
    }
  }

  // Save best deals to Supabase
  for (const [routeKey, best] of Object.entries(bestDeals)) {
    const [origin, dest] = routeKey.split('-')
    const { data: existing } = await supabase
      .from('deals')
      .select('id, deal_price')
      .eq('origin_code', origin)
      .eq('dest_code', dest)
      .eq('is_active', true)
      .maybeSingle()

    if (existing) {
      if (best.price > existing.deal_price * 1.2) {
        await supabase.from('deals').update({ is_active: false }).eq('id', existing.id)
        await supabase.from('deals').insert(best.data)
        totalExpired++
        totalNew++
      } else {
        await supabase.from('deals').update({
          deal_price: best.price,
          savings_pct: best.data.savings_pct,
          expires_at: best.data.expires_at,
          travel_dates: best.data.travel_dates
        }).eq('id', existing.id)
      }
    } else {
      const { error } = await supabase.from('deals').insert(best.data)
      if (!error) totalNew++
      else errors.push({ route: routeKey, error: error.message })
    }
  }

  console.log(`Done. Scanned: ${totalScanned}, Deals found: ${Object.keys(bestDeals).length}, New: ${totalNew}`)
  return { totalScanned, totalNew, totalExpired, dealsFound: Object.keys(bestDeals).length, errors: errors.slice(0, 5) }
}
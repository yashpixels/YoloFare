import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function sitemap() {
  const base = 'https://www.yolofare.com'
  const now = new Date().toISOString()

  // Static pages
  const staticPages = [
    { url: base,              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/deals`,   lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/login`,   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Competitor comparison pages
  const competitors = ['zomunk', 'happyfares', 'wowfare', 'sastafare']
  const vsPages = competitors.map(c => ({
    url: `${base}/vs/${c}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic deal pages
  let dealPages = []
  try {
    const { data: deals } = await supabase
      .from('deals')
      .select('id, updated_at')
      .eq('is_active', true)

    if (deals) {
      dealPages = deals.map(deal => ({
        url: `${base}/deals/${deal.id}`,
        lastModified: deal.updated_at || now,
        changeFrequency: 'daily',
        priority: 0.8,
      }))
    }
  } catch (e) {}

  return [...staticPages, ...vsPages, ...dealPages]
}

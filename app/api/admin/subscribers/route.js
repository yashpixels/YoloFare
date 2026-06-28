export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_PASSWORD = 'yolofare@admin2026'

export async function POST(request) {
  try {
    const { password } = await request.json()
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch active subscriptions (service role key bypasses RLS)
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select('user_id, status, plan, created_at, expires_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (subsError) throw subsError
    if (!subs?.length) return Response.json({ subscribers: [] })

    const userIds = subs.map(s => s.user_id)

    // Fetch preferences
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('*')
      .in('user_id', userIds)

    const prefsMap = {}
    if (prefs) prefs.forEach(p => { prefsMap[p.user_id] = p })

    // Fetch auth users for emails
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const userMap = {}
    if (users) users.forEach(u => { userMap[u.id] = u })

    const enriched = subs.map(s => ({
      user_id: s.user_id,
      status: s.status,
      plan: s.plan,
      created_at: s.created_at,
      expires_at: s.expires_at,
      email: userMap[s.user_id]?.email || '—',
      prefs: prefsMap[s.user_id] || null,
    }))

    return Response.json({ subscribers: enriched })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

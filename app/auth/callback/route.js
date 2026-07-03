import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/deals'

  if (code) {
    // Collect cookies before we know the redirect destination
    const pendingCookies = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            pendingCookies.push(...cookiesToSet)
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    // New users (no preferences yet) go to preferences setup first
    let redirectTo = next
    if (session?.user) {
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (!prefs) redirectTo = '/preferences'
    }

    const response = NextResponse.redirect(`${origin}${redirectTo}`)
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })
    return response
  }

  return NextResponse.redirect(`${origin}${next}`)
}

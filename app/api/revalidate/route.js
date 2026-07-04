import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  const paths = [
    '/vs/makemytrip',
    '/vs/skyscanner',
    '/vs/google-flights',
    '/vs/cleartrip',
    '/vs/ixigo',
    '/vs/easemytrip',
    '/vs/kayak',
  ]

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths })
}

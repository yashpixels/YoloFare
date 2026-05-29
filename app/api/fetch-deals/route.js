import { fetchAndStoreDeal } from '../../../lib/fetchDeals'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'yolofare-cron-2026'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fetchAndStoreDeal()
    return Response.json({ success: true, ...result })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
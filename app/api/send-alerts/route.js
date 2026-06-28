export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
// resend is initialized inside POST handler

function buildEmailHtml({ deals }) {
  const dealsHtml = deals.map(deal => `
    <tr><td style="padding:0 0 16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1510;border:1px solid rgba(255,92,58,0.2);border-radius:14px;overflow:hidden;">
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size:11px;color:rgba(255,245,236,0.4);letter-spacing:1.5px;text-transform:uppercase;">${deal.origin_code} â†’ ${deal.dest_code}</span><br/>
                <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#FFF5EC;">${deal.destination}</span><br/>
                <span style="font-size:12px;color:rgba(255,245,236,0.5);">${deal.airline} Â· ${deal.cabin_class} Â· ${deal.stops===0?'Non-stop':'1 stop'} Â· ${deal.travel_dates}</span>
              </td>
              <td style="text-align:right;vertical-align:top;">
                <span style="background:#FF5C3A;color:white;font-size:12px;font-weight:700;padding:5px 12px;border-radius:100px;">${deal.savings_pct}% off</span><br/><br/>
                <span style="font-size:26px;font-weight:800;color:#FF5C3A;">â‚¹${deal.deal_price?.toLocaleString('en-IN')}</span><br/>
                <span style="font-size:13px;color:rgba(255,245,236,0.35);text-decoration:line-through;">â‚¹${deal.regular_price?.toLocaleString('en-IN')}</span>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td><a href="https://yolofare.com/deals/${deal.id}" style="background:#FF5C3A;color:white;padding:10px 22px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">View deal â†’</a></td>
              <td style="text-align:right;"><a href="${deal.booking_url||`https://www.google.com/travel/flights?q=flights+from+${deal.origin_code}+to+${deal.dest_code}`}" style="color:rgba(255,245,236,0.5);font-size:12px;text-decoration:none;">Book on Google Flights â†—</a></td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  `).join('')

  const isSingle = deals.length === 1
  const deal = deals[0]
  return {
    subject: isSingle
      ? `âœˆï¸ New deal: ${deal.origin_code} â†’ ${deal.dest_code} from â‚¹${deal.deal_price?.toLocaleString('en-IN')} (${deal.savings_pct}% off)`
      : `âœˆï¸ ${deals.length} new deals just dropped â€” YoloFare Pro`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0D0A08;font-family:'DM Sans',-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0A08;padding:40px 20px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="padding:0 0 32px 0;text-align:center;"><span style="font-size:22px;font-weight:800;color:#FFF5EC;">Yolo<span style="color:#FF5C3A;">Fare</span></span></td></tr>
  <tr><td style="background:linear-gradient(135deg,rgba(255,92,58,0.12) 0%,rgba(255,92,58,0.04) 100%);border:1px solid rgba(255,92,58,0.25);border-radius:20px;padding:32px;text-align:center;">
    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,245,236,0.4);letter-spacing:2px;text-transform:uppercase;">Pro Member Alert</p>
    <h1 style="margin:0 0 12px 0;font-size:26px;font-weight:800;color:#FFF5EC;letter-spacing:-1px;line-height:1.1;">âœˆï¸ ${isSingle?`New deal just dropped`:`${deals.length} new deals just dropped`}</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,245,236,0.55);font-weight:300;">${isSingle?`${deal.destination} Â· ${deal.cabin_class} Â· Act fast`:`${deals.length} fresh deals Â· Book fast, deals expire`}</p>
  </td></tr>
  <tr><td style="padding:24px 0 8px 0;"><p style="margin:0;font-size:11px;color:rgba(255,245,236,0.3);letter-spacing:2px;text-transform:uppercase;">${isSingle?'New deal':"Today's deals"}</p></td></tr>
  ${dealsHtml}
  <tr><td style="padding:8px 0 32px 0;text-align:center;"><a href="https://yolofare.com/deals" style="background:#FF5C3A;color:white;padding:16px 40px;border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;">View all deals â†’</a></td></tr>
  <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding:24px 0 0 0;text-align:center;">
    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,245,236,0.25);">You're receiving this as a YoloFare Pro member.</p>
    <p style="margin:0;font-size:12px;color:rgba(255,245,236,0.2);">Â© 2026 YoloFare Â· <a href="https://yolofare.com/preferences" style="color:rgba(255,92,58,0.6);text-decoration:none;">Update preferences</a></p>
  </td></tr>
</table></td></tr></table></body></html>`
  }
}

export async function POST(request) {
  try {
    const { secret, dealId } = await request.json()
    const validSecret = process.env.CRON_SECRET || 'yolofare-cron-2026'
    if (secret !== validSecret) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch deal(s)
    let deals = []
    if (dealId) {
      const { data, error } = await supabase.from('deals').select('*').eq('id', dealId).single()
      if (error) throw error
      deals = [data]
    } else {
      const { data, error } = await supabase.from('deals').select('*').eq('is_active', true).order('created_at', { ascending: false })
      if (error) throw error
      deals = data || []
    }
    if (!deals.length) return Response.json({ message: 'No deals found', emailsSent: 0, whatsappSent: 0, totalSubscribers: 0 })

    const deal = deals[0]

    // Get all Pro subscribers
    const { data: subscribers } = await supabase.from('subscriptions').select('user_id, status').eq('status', 'active')
    if (!subscribers?.length) return Response.json({ message: 'No active subscribers', emailsSent: 0, whatsappSent: 0, totalSubscribers: 0 })

    // Get user preferences for all subscribers
    const userIds = subscribers.map(s => s.user_id)
    const { data: allPrefs } = await supabase.from('user_preferences').select('*').in('user_id', userIds)
    const prefsMap = {}
    if (allPrefs) allPrefs.forEach(p => { prefsMap[p.user_id] = p })

    // Get emails
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const proUsers = users.filter(u => userIds.includes(u.id))

    // â”€â”€ Filter by preferences â”€â”€
    // A subscriber gets the alert if:
    // 1. They have no preferred_destinations set (empty = all deals)
    // 2. OR their preferred_destinations includes this deal's dest_code
    // 3. AND if they have preferred_origins set, deal's origin_code must be in it
    // 4. AND if they have preferred_class set (not 'All Classes'), deal's cabin_class must match
    function subscriberWantsDeal(userId, deal) {
      const p = prefsMap[userId]
      if (!p) return true // no prefs = send everything
      const dests = p.preferred_destinations || []
      const origins = p.preferred_origins || []
      const cls = p.preferred_class || 'All Classes'
      if (dests.length > 0 && !dests.includes(deal.dest_code)) return false
      if (origins.length > 0 && !origins.includes(deal.origin_code)) return false
      if (cls !== 'All Classes' && cls !== 'All' && deal.cabin_class !== cls) return false
      return true
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { subject, html } = buildEmailHtml({ deals })
    const emailResults = []

    for (const user of proUsers) {
      if (!user.email) continue
      if (!subscriberWantsDeal(user.id, deal)) continue // skip if doesn't match prefs
      try {
        const result = await resend.emails.send({ from: 'YoloFare Deals <deals@yolofare.com>', to: user.email, subject, html })
        emailResults.push({ email: user.email, success: true, id: result.id })
      } catch (err) {
        emailResults.push({ email: user.email, success: false, error: err.message })
      }
    }

    // WhatsApp via Wati
    const whatsappResults = []
    if (process.env.WATI_API_ENDPOINT && process.env.WATI_ACCESS_TOKEN) {
      // phone + whatsapp_opted_in live in user_preferences, not subscriptions
      const watiSubs = subscribers.filter(s => {
        const p = prefsMap[s.user_id]
        return p?.whatsapp_opted_in && p?.phone && subscriberWantsDeal(s.user_id, deal)
      }).map(s => ({ ...s, phone: prefsMap[s.user_id].phone }))
      for (const sub of watiSubs) {
        try {
          await fetch(`${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.WATI_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ template_name: 'yolofare_deal_alert', broadcast_name: `deal_${Date.now()}`, receivers: [{ whatsappNumber: sub.phone.replace(/\D/g,''), customParams: [{ name:'1',value:'there'},{name:'2',value:deal.origin_code},{name:'3',value:deal.dest_code},{name:'4',value:deal.deal_price?.toLocaleString('en-IN')},{name:'5',value:String(deal.savings_pct)},{name:'6',value:deal.airline},{name:'7',value:deal.cabin_class}] }] })
          })
          whatsappResults.push({ phone: sub.phone, success: true })
        } catch (err) {
          whatsappResults.push({ phone: sub.phone, success: false })
        }
      }
    }

    return Response.json({
      success: true,
      emailsSent: emailResults.filter(r => r.success).length,
      whatsappSent: whatsappResults.filter(r => r.success).length,
      totalSubscribers: proUsers.length,
      matchedSubscribers: emailResults.length,
      dealName: `${deal.origin_code} â†’ ${deal.dest_code} Â· ${deal.destination}`,
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}



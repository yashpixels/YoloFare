import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

// ── Beautiful HTML email template ──
function buildEmailHtml({ deals, recipientEmail }) {
  const dealsHtml = deals.slice(0, 5).map(deal => `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #1a1510; border: 1px solid rgba(255,92,58,0.2); border-radius: 14px; overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: rgba(255,245,236,0.4); letter-spacing: 1.5px; text-transform: uppercase;">${deal.origin_code} → ${deal.dest_code}</span>
                    <br/>
                    <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #FFF5EC;">${deal.destination}</span>
                    <br/>
                    <span style="font-size: 12px; color: rgba(255,245,236,0.5);">${deal.airline} · ${deal.cabin_class} · ${deal.stops === 0 ? 'Non-stop' : '1 stop'} · ${deal.travel_dates}</span>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <span style="background: #FF5C3A; color: white; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 100px;">${deal.savings_pct}% off</span>
                    <br/><br/>
                    <span style="font-size: 26px; font-weight: 800; color: #FF5C3A;">₹${deal.deal_price?.toLocaleString('en-IN')}</span>
                    <br/>
                    <span style="font-size: 13px; color: rgba(255,245,236,0.35); text-decoration: line-through;">₹${deal.regular_price?.toLocaleString('en-IN')}</span>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td>
                    <a href="https://yolofare.com/deals/${deal.id}" style="background: #FF5C3A; color: white; padding: 10px 22px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-block;">
                      View deal →
                    </a>
                  </td>
                  <td style="text-align: right;">
                    <a href="${deal.booking_url || `https://www.google.com/travel/flights?q=flights+from+${deal.origin_code}+to+${deal.dest_code}`}" style="color: rgba(255,245,236,0.5); font-size: 12px; text-decoration: none;">
                      Book on Google Flights ↗
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin: 0; padding: 0; background: #0D0A08; font-family: 'DM Sans', -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #0D0A08; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 0 0 32px 0; text-align: center;">
              <span style="font-size: 22px; font-weight: 800; color: #FFF5EC; letter-spacing: -0.5px;">
                Yolo<span style="color: #FF5C3A;">Fare</span>
              </span>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(255,92,58,0.12) 0%, rgba(255,92,58,0.04) 100%); border: 1px solid rgba(255,92,58,0.25); border-radius: 20px; padding: 32px 32px 28px; text-align: center; margin-bottom: 28px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255,245,236,0.4); letter-spacing: 2px; text-transform: uppercase;">Pro Member Alert</p>
              <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 800; color: #FFF5EC; letter-spacing: -1px; line-height: 1.1;">
                ✈️ New flight deals just dropped
              </h1>
              <p style="margin: 0; font-size: 15px; color: rgba(255,245,236,0.55); font-weight: 300;">
                ${deals.length} fresh deal${deals.length !== 1 ? 's' : ''} · Updated just now · Book fast, they expire soon
              </p>
            </td>
          </tr>

          <tr><td style="padding: 24px 0 8px 0;">
            <p style="margin: 0; font-size: 11px; color: rgba(255,245,236,0.3); letter-spacing: 2px; text-transform: uppercase;">Today's deals</p>
          </td></tr>

          <!-- Deals -->
          ${dealsHtml}

          <!-- CTA -->
          <tr>
            <td style="padding: 8px 0 32px 0; text-align: center;">
              <a href="https://yolofare.com/deals" style="background: #FF5C3A; color: white; padding: 16px 40px; border-radius: 100px; font-size: 16px; font-weight: 700; text-decoration: none; display: inline-block; letter-spacing: -0.3px;">
                View all ${deals.length} deals →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid rgba(255,255,255,0.08); padding: 24px 0 0 0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255,245,236,0.25);">
                You're receiving this as a YoloFare Pro member.
              </p>
              <p style="margin: 0; font-size: 12px; color: rgba(255,245,236,0.2);">
                © 2026 YoloFare · Sweet flight deals from India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request) {
  try {
    const { secret } = await request.json()

    // Basic auth check
    if (secret !== process.env.CRON_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Get all active deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (dealsError) throw dealsError
    if (!deals?.length) {
      return Response.json({ message: 'No active deals to send', sent: 0 })
    }

    // 2. Get all pro subscribers
    // Join subscriptions with auth.users to get emails
    const { data: subscribers, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id, status, phone, whatsapp_opted_in')
      .eq('status', 'active')

    if (subError) throw subError
    if (!subscribers?.length) {
      return Response.json({ message: 'No active subscribers', sent: 0 })
    }

    // 3. Get emails for each subscriber
    const userIds = subscribers.map(s => s.user_id)
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) throw usersError

    const proUsers = users.filter(u => userIds.includes(u.id))

    // 4. Send emails via Resend
    const emailResults = []
    for (const user of proUsers) {
      if (!user.email) continue
      try {
        const result = await resend.emails.send({
          from: 'YoloFare Deals <deals@yolofare.com>',
          to: user.email,
          subject: `✈️ ${deals.length} new deals just dropped — YoloFare Pro`,
          html: buildEmailHtml({ deals, recipientEmail: user.email }),
        })
        emailResults.push({ email: user.email, success: true, id: result.id })
      } catch (err) {
        emailResults.push({ email: user.email, success: false, error: err.message })
      }
    }

    // 5. WhatsApp via Wati (stub — activates when WATI keys are set)
    const whatsappResults = []
    if (process.env.WATI_API_ENDPOINT && process.env.WATI_ACCESS_TOKEN) {
      const watiSubs = subscribers.filter(s => s.whatsapp_opted_in && s.phone)
      const topDeal = deals[0]
      for (const sub of watiSubs) {
        try {
          const res = await fetch(`${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WATI_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              template_name: 'yolofare_deal_alert',
              broadcast_name: `deal_alert_${Date.now()}`,
              receivers: [{
                whatsappNumber: sub.phone.replace(/\D/g, ''),
                customParams: [
                  { name: '1', value: 'there' },
                  { name: '2', value: topDeal.origin_code },
                  { name: '3', value: topDeal.dest_code },
                  { name: '4', value: topDeal.deal_price?.toLocaleString('en-IN') },
                  { name: '5', value: String(topDeal.savings_pct) },
                  { name: '6', value: topDeal.airline },
                  { name: '7', value: topDeal.cabin_class },
                ]
              }]
            })
          })
          const data = await res.json()
          whatsappResults.push({ phone: sub.phone, success: true })
        } catch (err) {
          whatsappResults.push({ phone: sub.phone, success: false, error: err.message })
        }
      }
    }

    const emailsSent = emailResults.filter(r => r.success).length
    const whatsappSent = whatsappResults.filter(r => r.success).length

    return Response.json({
      success: true,
      emailsSent,
      whatsappSent,
      totalSubscribers: proUsers.length,
      dealsIncluded: deals.length,
      details: { emails: emailResults, whatsapp: whatsappResults }
    })

  } catch (error) {
    console.error('Send alerts error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

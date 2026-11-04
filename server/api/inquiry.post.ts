/**
 * 询盘接收：Turnstile 人机验证 + Resend 发信，所有密钥只存在于服务端。
 *
 * 为什么不用 Web3Forms 做服务端转发：它的 API 挂在 Cloudflare 后面，
 * 对所有"服务器对服务器"请求返回 403（cf-mitigated: challenge），
 * 实测 Node fetch 与浏览器 UA 均被拦，该路线不存在可行解。
 *
 * 未配置 TURNSTILE_SECRET_KEY / RESEND_API_KEY 时本接口返回 501，
 * 前端收到 501 会自动回退为浏览器直连 Web3Forms，保证询盘永远发得出去。
 */
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 3
const hits = new Map<string, number[]>()

const fail = (field: string, message: string) => {
  throw createError({
    statusCode: 400,
    statusMessage: message,
    data: { field, message },
    message
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const turnstileSecret = String(config.turnstileSecretKey || '')
  const resendKey = String(config.resendApiKey || '')

  // 未配置就明确告知前端去走直连，而不是让客户看到"发送失败"
  if (!resendKey) {
    throw createError({
      statusCode: 501,
      statusMessage: 'Server-side inquiry is not configured',
      data: { fallback: true }
    })
  }

  const body = await readBody(event)

  // honeypot 命中：当成成功直接返回，机器人拿不到任何信息
  if (String(body?.botfield || '').trim()) return { success: true }

  const name = String(body?.name || '').trim().slice(0, 100)
  const email = String(body?.email || '').trim().slice(0, 200)
  const message = String(body?.message || '').trim().slice(0, 5000)

  if (!name) fail('name', 'Please enter your name')
  if (!email) fail('email', 'Please enter your email address')
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(email)) {
    fail('email', 'Please check this email address — it looks invalid')
  }
  if (!message) fail('message', 'Please tell us what you need')

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  // 同一个 IP 10 分钟内最多 3 次，脚本刷不出量
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many submissions',
      data: { field: 'form', message: 'Too many submissions from this network. Please wait a few minutes or message us on WhatsApp.' }
    })
  }
  recent.push(now)
  hits.set(ip, recent)

  // 人机验证：配了 secret 就必须过，token 一次性使用
  if (turnstileSecret) {
    const token = String(body?.turnstileToken || '').trim()
    if (!token) fail('turnstile', 'Please complete the verification below')
    const verify = await $fetch<{ success?: boolean; 'error-codes'?: string[] }>(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { secret: turnstileSecret, response: token, remoteip: ip },
        timeout: 10000
      }
    ).catch(() => null)

    if (!verify?.success) {
      fail('turnstile', 'Verification failed, please tick the box again')
    }
  }

  const company = String(body?.company || '').trim().slice(0, 200) || 'N/A'
  const phone = String(body?.phone || '').trim().slice(0, 60) || 'N/A'
  const product = String(body?.product || '').trim().slice(0, 200) || 'N/A'
  const quantity = String(body?.quantity || '').trim().slice(0, 60) || 'N/A'

  const to = String(config.inquiryTo || 'Marc@tutesports.com')
  const from = String(config.resendFrom || 'TontonSports Website <onboarding@resend.dev>')

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Company', company],
    ['Phone / WhatsApp', phone],
    ['Product Interest', product],
    ['Estimated Quantity', quantity]
  ]

  const html = `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.6">
  <h2 style="margin:0 0 12px">New inquiry from ${escapeHtml(name)}</h2>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="color:#64748b">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`).join('\n    ')}
  </table>
  <p style="color:#64748b;font-size:13px;margin-top:16px">Message:</p>
  <div style="white-space:pre-wrap;border-left:3px solid #e2e8f0;padding-left:12px">${escapeHtml(message)}</div>
  <p style="color:#94a3b8;font-size:12px;margin-top:20px">Submitted from www.tutesports.com · IP ${escapeHtml(ip)}</p>
</div>`

  const text = [
    `New inquiry from ${name}`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    message,
    '',
    `Submitted from www.tutesports.com · IP ${ip}`
  ].join('\n')

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        from,
        to: [to],
        reply_to: email,
        subject: `Inquiry from ${name} - ${company}`,
        html,
        text
      },
      timeout: 15000
    })
  } catch (err: any) {
    // Resend 的报错原样透出，方便在 Vercel 日志里直接看出是域名未验证还是 key 失效
    const detail = err?.data?.message || err?.message || 'unknown error'
    console.error('[inquiry] resend failed:', detail)
    throw createError({
      statusCode: 502,
      statusMessage: 'Inquiry could not be delivered',
      data: { field: 'form', message: 'We could not send your message just now. Please try again, or reach us on WhatsApp.' }
    })
  }

  return { success: true }
})

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

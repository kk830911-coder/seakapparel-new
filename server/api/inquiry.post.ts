/**
 * 询盘提交的服务端代理。
 * Web3Forms 的 access_key 只放在服务端环境变量里（WEB3FORMS_KEY），
 * 不再打包进浏览器 JS，避免额度被他人调用刷爆。
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const accessKey = config.web3formsKey

  if (!accessKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Inquiry service is not configured'
    })
  }

  // honeypot 命中：不消耗额度，直接返回成功（机器人无感知）
  if (String(body?.botfield || '').trim()) {
    return { success: true }
  }

  const name = String(body?.name || '').trim().slice(0, 100)
  const email = String(body?.email || '').trim().slice(0, 200)
  const message = String(body?.message || '').trim().slice(0, 5000)

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid name, email and message'
    })
  }

  const company = String(body?.company || '').trim().slice(0, 200) || 'N/A'
  const phone = String(body?.phone || '').trim().slice(0, 60) || 'N/A'
  const product = String(body?.product || '').trim().slice(0, 200) || 'N/A'
  const quantity = String(body?.quantity || '').trim().slice(0, 60) || 'N/A'

  try {
    const result = await $fetch<{ success?: boolean; message?: string }>(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: {
          access_key: accessKey,
          subject: `Inquiry from ${name} - ${company}`,
          from_name: 'TontonSports Website',
          replyto: email,
          name,
          email,
          company,
          phone,
          product,
          quantity,
          message
        },
        timeout: 15000
      }
    )

    if (!result?.success) {
      throw createError({ statusCode: 502, statusMessage: 'Inquiry could not be delivered' })
    }

    return { success: true }
  } catch (err) {
    // 已经是我们自己的 HTTP 错误就直接抛，别的（网络超时等）统一 502
    if (err && typeof err === 'object' && 'statusCode' in err) throw err
    throw createError({ statusCode: 502, statusMessage: 'Inquiry service unavailable' })
  }
})

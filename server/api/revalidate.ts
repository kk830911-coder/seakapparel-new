/**
 * 按需重渲染接口（方案 B）
 *
 * 用途：Strapi 内容发布后，只让 Vercel 重新生成受影响的那几个页面，
 *      而不是整站重建，也不需要等 ISR 过期。
 *
 * 调用方式：
 *   1. Strapi 后台 Settings → Webhooks，URL 填
 *      https://www.tutesports.com/api/revalidate?secret=你的密钥
 *      事件勾选 entry.publish / entry.unpublish / entry.delete
 *   2. 手动测试：GET /api/revalidate?secret=xxx&path=/products/abc
 *
 * 需要的环境变量（Vercel 项目 Settings → Environment Variables）：
 *   REVALIDATE_SECRET          密钥，用于校验调用方
 *   REVALIDATE_BYPASS_TOKEN    与 nuxt.config 里 vercel.config.bypassToken 同一个值
 *   DEPLOY_HOOK_URL            （可选）Vercel Deploy Hook，用于 ?full=1 全量重建兜底
 */

type StrapiWebhookBody = {
  event?: string
  model?: string
  uid?: string
  entry?: { slug?: string; publishedAt?: string | null } | null
}

/** 根据内容类型 + slug 推导需要重新生成的页面路径 */
export function pathsForContent(model: string, slug?: string): string[] {
  const m = String(model || '').toLowerCase()
  const paths = new Set<string>()

  if (m.includes('product')) {
    paths.add('/products')
    paths.add('/')
    if (slug) paths.add(`/products/${slug}`)
  } else if (m.includes('category')) {
    paths.add('/products')
    paths.add('/')
  } else if (m.includes('blog') || m.includes('post') || m.includes('article')) {
    paths.add('/blog')
    if (slug) paths.add(`/blog/${slug}`)
  } else if (m.includes('faq')) {
    paths.add('/faq')
    if (slug) paths.add(`/faq/${slug}`)
  }

  return [...paths]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = config.revalidateSecret
  const bypassToken = config.revalidateBypassToken
  const deployHook = config.deployHookUrl

  const query = getQuery(event)
  const body: StrapiWebhookBody =
    event.method === 'POST' ? await readBody(event).catch(() => ({})) : {}

  // 鉴权：query / header 里的 secret 必须匹配
  const provided = query.secret || getHeader(event, 'x-revalidate-secret') || ''
  if (!secret || provided !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid revalidate secret' })
  }

  const origin = getRequestURL(event).origin

  // 1) 草稿保存不触发重渲染（只需要发布后的状态）
  const isDraftOnly =
    !!body.event &&
    /update|create/.test(body.event) &&
    body.entry &&
    body.entry.publishedAt === null
  if (isDraftOnly && !query.path) {
    return { ok: true, skipped: 'draft', paths: [] }
  }

  // 2) 全量重建兜底（方案 A）：?full=1 时直接触发 Vercel Deploy Hook
  const wantFullDeploy = query.full === '1' || query.full === 'true'
  if (wantFullDeploy) {
    if (!deployHook) {
      return { ok: false, error: 'DEPLOY_HOOK_URL is not set', hint: '在 Vercel 环境变量里配置后重新部署' }
    }
    try {
      await fetch(deployHook, { method: 'POST' })
      return { ok: true, mode: 'full-deploy' }
    } catch (error: any) {
      return { ok: false, mode: 'full-deploy', error: error.message }
    }
  }

  // 3) 计算要重渲染的路径
  let paths: string[] = []
  if (query.path) {
    paths = String(query.path)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
  } else {
    const model = body.model || body.uid || ''
    paths = pathsForContent(model, body.entry?.slug)
  }

  if (paths.length === 0) {
    return { ok: true, skipped: 'no-matching-paths', model: body.model || body.uid || null }
  }

  // 4) 按需重渲染：带着 Vercel bypass token 请求这些页面，Vercel 会重新生成它们的 ISR 缓存
  if (!bypassToken) {
    return {
      ok: false,
      error: 'REVALIDATE_BYPASS_TOKEN is not set',
      hint: '在 Vercel 环境变量里配置后重新部署',
      paths,
    }
  }

  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(`${origin}${path}`, {
          headers: {
            'x-prerender-revalidate': bypassToken,
            'x-revalidate-source': 'strapi-webhook',
          },
        })
        // 读掉响应体，确保请求真正完成
        await res.text()
        return { path, status: res.status, ok: res.ok }
      } catch (error: any) {
        return { path, ok: false, error: error.message }
      }
    })
  )

  console.log('[revalidate]', JSON.stringify({ model: body.model || body.uid, event: body.event, results }))

  return {
    ok: results.every((r) => r.ok),
    mode: 'on-demand',
    event: body.event || null,
    model: body.model || body.uid || null,
    results,
  }
})
